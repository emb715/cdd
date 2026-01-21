#!/usr/bin/env node

/**
 * Metrics Collection Script (v2)
 *
 * Scans all CONTEXT.md files in the cdd/ directory and aggregates
 * OPTIONAL metrics into a summary JSON file for dashboard consumption.
 *
 * v2 Changes:
 * - Looks for CONTEXT.md instead of DECISIONS.md
 * - Handles optional metrics (only processes if metrics exist)
 * - Skips work items without metrics enabled
 * - Cleaner, simpler output
 */

const fs = require('fs');
const path = require('path');

/**
 * Find all CONTEXT.md files in a directory
 * @param {string} rootDir - Root directory to search
 * @returns {Array<string>} - Array of file paths
 */
function findContextFiles(rootDir) {
  const results = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, hidden directories, and .meta
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(fullPath);
        }
      } else if (entry.name === 'CONTEXT.md') {
        results.push(fullPath);
      }
    }
  }

  scan(rootDir);
  return results;
}

/**
 * Parse YAML frontmatter from markdown
 * @param {string} content - File content
 * @returns {Object} - Parsed frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return {};

  const yamlString = match[1];
  const result = {};
  const lines = yamlString.split(/\r?\n/);

  let currentSection = result;
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Nested section (e.g., "metrics:")
    if (line.match(/^(\w+):$/)) {
      currentKey = line.replace(':', '').trim();
      currentSection[currentKey] = {};
      currentSection = currentSection[currentKey];
      continue;
    }

    // Indented key-value (nested under section)
    const indentedMatch = line.match(/^\s+([^:]+):\s*(.*)$/);
    if (indentedMatch && currentSection !== result) {
      const [, key, value] = indentedMatch;
      currentSection[key.trim()] = parseValue(value.trim());
      continue;
    }

    // Top-level key-value
    const kvMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      result[key.trim()] = parseValue(value.trim());
      currentSection = result;
    }
  }

  return result;
}

/**
 * Parse YAML value to appropriate type
 */
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '') return null;
  if (/^-?\d+\.?\d*$/.test(value)) {
    return value.includes('.') ? parseFloat(value) : parseInt(value, 10);
  }
  return value.replace(/^["']|["']$/g, '');
}

/**
 * Extract numeric ID from work item path
 */
function extractWorkItemId(filePath) {
  const match = filePath.match(/\/(\d{4})-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Collect metrics from a single work item
 * @param {string} filePath - Path to CONTEXT.md
 * @returns {Object|null} - Metrics object or null if no metrics/invalid
 */
function collectWorkItemMetrics(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    const workId = extractWorkItemId(filePath);

    if (!workId && !fm.id) {
      console.warn(`⚠️  Skipping ${filePath}: no valid ID found`);
      return null;
    }

    // Check if metrics are enabled for this work item
    const hasMetrics = fm.metrics && typeof fm.metrics === 'object';

    if (!hasMetrics) {
      // Silently skip work items without metrics (this is expected in v2)
      return null;
    }

    // Extract metrics with defaults
    const metrics = {
      id: workId || parseInt(fm.id, 10),
      title: fm.title || 'Untitled',
      type: fm.type || 'unknown',
      status: fm.status || 'unknown',
      created: fm.created || null,
      updated: fm.updated || null,
      sessions: fm.metrics.sessions || 0,
      hours: fm.metrics.hours || 0,
      tasks_completed: fm.metrics.tasks_completed || 0,
      tasks_planned: fm.metrics.tasks_planned || 0
    };

    // Calculate derived metrics
    metrics.completion_percentage = metrics.tasks_planned > 0
      ? Math.round((metrics.tasks_completed / metrics.tasks_planned) * 100)
      : 0;

    metrics.avg_session_duration = metrics.sessions > 0
      ? Math.round((metrics.hours / metrics.sessions) * 10) / 10
      : 0;

    return metrics;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Aggregate metrics from all work items
 */
function aggregateMetrics(cddDir) {
  console.log(`🔍 Scanning for CONTEXT.md files in ${cddDir}...`);

  const contextFiles = findContextFiles(cddDir);
  console.log(`📊 Found ${contextFiles.length} work item(s)`);

  const items = [];
  let totalSessions = 0;
  let totalHours = 0;
  let totalCompletedTasks = 0;
  let totalPlannedTasks = 0;
  let trackedCount = 0;

  for (const filePath of contextFiles) {
    const metrics = collectWorkItemMetrics(filePath);

    if (metrics) {
      items.push(metrics);
      totalSessions += metrics.sessions;
      totalHours += metrics.hours;
      totalCompletedTasks += metrics.tasks_completed;
      totalPlannedTasks += metrics.tasks_planned;
      trackedCount++;

      console.log(`  ✓ ${metrics.id.toString().padStart(4, '0')} - ${metrics.title} (tracked)`);
    }
  }

  // Sort by ID
  items.sort((a, b) => a.id - b.id);

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      workItems: contextFiles.length,
      workItemsTracked: trackedCount,
      workItemsUntracked: contextFiles.length - trackedCount,
      sessions: totalSessions,
      hours: Math.round(totalHours * 10) / 10,
      completedTasks: totalCompletedTasks,
      plannedTasks: totalPlannedTasks
    },
    averages: {
      sessionsPerWorkItem: trackedCount > 0 ? Math.round((totalSessions / trackedCount) * 10) / 10 : 0,
      hoursPerWorkItem: trackedCount > 0 ? Math.round((totalHours / trackedCount) * 10) / 10 : 0,
      sessionDuration: totalSessions > 0 ? Math.round((totalHours / totalSessions) * 10) / 10 : 0,
      completionRate: totalPlannedTasks > 0 ? Math.round((totalCompletedTasks / totalPlannedTasks) * 100) : 0
    },
    items
  };

  return summary;
}

/**
 * Generate metrics report in markdown format
 */
function generateMarkdownReport(summary) {
  const lines = [];

  lines.push('# Metrics Summary Report');
  lines.push('');
  lines.push(`Generated: ${new Date(summary.generatedAt).toLocaleString()}`);
  lines.push('');

  lines.push('## Overall Totals');
  lines.push('');
  lines.push(`- **Total Work Items:** ${summary.totals.workItems}`);
  lines.push(`- **Metrics Tracked:** ${summary.totals.workItemsTracked}`);
  lines.push(`- **Metrics Disabled:** ${summary.totals.workItemsUntracked}`);
  lines.push(`- **Total Sessions:** ${summary.totals.sessions}`);
  lines.push(`- **Total Hours:** ${summary.totals.hours}`);
  lines.push(`- **Tasks Completed:** ${summary.totals.completedTasks} / ${summary.totals.plannedTasks}`);
  lines.push('');

  if (summary.totals.workItemsTracked > 0) {
    lines.push('## Averages (Tracked Items Only)');
    lines.push('');
    lines.push(`- **Sessions per Work Item:** ${summary.averages.sessionsPerWorkItem}`);
    lines.push(`- **Hours per Work Item:** ${summary.averages.hoursPerWorkItem}`);
    lines.push(`- **Session Duration:** ${summary.averages.sessionDuration} hours`);
    lines.push(`- **Overall Completion Rate:** ${summary.averages.completionRate}%`);
    lines.push('');

    lines.push('## Tracked Work Items');
    lines.push('');
    lines.push('| ID | Title | Status | Sessions | Hours | Tasks | Completion |');
    lines.push('|----|-------|--------|----------|-------|-------|------------|');

    for (const item of summary.items) {
      lines.push(
        `| ${item.id.toString().padStart(4, '0')} | ` +
        `${item.title} | ` +
        `${item.status} | ` +
        `${item.sessions} | ` +
        `${item.hours} | ` +
        `${item.tasks_completed}/${item.tasks_planned} | ` +
        `${item.completion_percentage}% |`
      );
    }
  } else {
    lines.push('## No Tracked Work Items');
    lines.push('');
    lines.push('ℹ️  No work items have metrics enabled yet.');
    lines.push('');
    lines.push('To enable metrics tracking:');
    lines.push('- Use `/cdd:start [description] --track-metrics` when creating work items');
    lines.push('- Or manually add a `metrics:` section to CONTEXT.md frontmatter');
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('💡 **Metrics are optional in CDD v2.0**');
  lines.push('   Only work items created with `--track-metrics` flag will appear here.');
  lines.push('');

  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Determine CDD directory
  const projectRoot = path.resolve(__dirname, '../../../..');
  const cddDir = args[0] || path.join(projectRoot, 'cdd');

  if (!fs.existsSync(cddDir)) {
    console.error(`❌ CDD directory not found: ${cddDir}`);
    process.exit(1);
  }

  console.log('📈 CDD Metrics Collection (v2.0)');
  console.log('='.repeat(50));
  console.log('');

  // Collect and aggregate metrics
  const summary = aggregateMetrics(cddDir);

  // Determine output paths
  const outputJson = path.join(projectRoot, 'cdd', '.meta', 'metrics-summary.json');
  const outputMd = path.join(projectRoot, 'cdd', '.meta', 'metrics-summary.md');

  // Ensure .meta directory exists
  const metaDir = path.dirname(outputJson);
  if (!fs.existsSync(metaDir)) {
    fs.mkdirSync(metaDir, { recursive: true });
  }

  // Write JSON output
  fs.writeFileSync(outputJson, JSON.stringify(summary, null, 2), 'utf8');
  console.log('');
  console.log(`✅ JSON summary written to: ${outputJson}`);

  // Write Markdown report
  const report = generateMarkdownReport(summary);
  fs.writeFileSync(outputMd, report, 'utf8');
  console.log(`✅ Markdown report written to: ${outputMd}`);

  // Display summary
  console.log('');
  console.log('📊 Summary');
  console.log('='.repeat(50));
  console.log(`Total Work Items: ${summary.totals.workItems}`);
  console.log(`Metrics Tracked: ${summary.totals.workItemsTracked}`);
  console.log(`Metrics Disabled: ${summary.totals.workItemsUntracked}`);

  if (summary.totals.workItemsTracked > 0) {
    console.log(`Total Sessions: ${summary.totals.sessions}`);
    console.log(`Total Hours: ${summary.totals.hours}`);
    console.log(`Avg Session: ${summary.averages.sessionDuration}h`);
    console.log(`Completion Rate: ${summary.averages.completionRate}%`);
  } else {
    console.log('');
    console.log('ℹ️  No work items have metrics enabled.');
    console.log('   This is normal in v2.0 (metrics are opt-in).');
  }

  console.log('');
  console.log('✨ Done!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  aggregateMetrics,
  collectWorkItemMetrics,
  generateMarkdownReport,
  findContextFiles
};
