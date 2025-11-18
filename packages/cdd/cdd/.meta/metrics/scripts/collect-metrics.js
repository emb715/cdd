#!/usr/bin/env node

/**
 * Metrics Collection Script
 * 
 * Scans all DECISIONS.md files in the cdd/ directory and aggregates
 * metrics into a summary JSON file for dashboard consumption.
 */

const fs = require('fs');
const path = require('path');
const { findDecisionsFiles, getFrontmatter } = require('./lib/frontmatter');

/**
 * Extract numeric ID from work item path
 * @param {string} filePath - Path to DECISIONS.md
 * @returns {number|null} - Numeric ID or null
 */
function extractWorkItemId(filePath) {
  const match = filePath.match(/\/(\d{4})-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Collect metrics from a single work item
 * @param {string} filePath - Path to DECISIONS.md
 * @returns {Object|null} - Metrics object or null if invalid
 */
function collectWorkItemMetrics(filePath) {
  try {
    const fm = getFrontmatter(filePath);
    const workId = extractWorkItemId(filePath);

    if (!workId && !fm.id) {
      console.warn(`⚠️  Skipping ${filePath}: no valid ID found`);
      return null;
    }

    // Extract metrics with defaults
    const metrics = {
      id: workId || parseInt(fm.id, 10),
      title: fm.title || 'Untitled',
      type: fm.type || 'unknown',
      status: fm.status || 'unknown',
      priority: fm.priority || 'medium',
      created: fm.created || null,
      updated: fm.updated || null,
      total_sessions: fm.total_sessions || 0,
      total_hours: fm.total_hours || 0,
      total_reacquisition_minutes: fm.total_reacquisition_minutes || 0,
      completed_tasks_total: fm.completed_tasks_total || 0,
      planned_tasks_total: fm.planned_tasks_total || 0,
      planned_parent_tasks_total: fm.planned_parent_tasks_total || 0,
      tags: fm.tags || ''
    };

    // Calculate derived metrics
    metrics.completion_percentage = metrics.planned_tasks_total > 0
      ? Math.round((metrics.completed_tasks_total / metrics.planned_tasks_total) * 100)
      : 0;

    metrics.avg_reacquisition_per_session = metrics.total_sessions > 0
      ? Math.round((metrics.total_reacquisition_minutes / metrics.total_sessions) * 10) / 10
      : 0;

    metrics.avg_session_duration = metrics.total_sessions > 0
      ? Math.round((metrics.total_hours / metrics.total_sessions) * 10) / 10
      : 0;

    return metrics;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Aggregate metrics from all work items
 * @param {string} cddDir - Path to cdd/ directory
 * @returns {Object} - Aggregated metrics summary
 */
function aggregateMetrics(cddDir) {
  console.log(`🔍 Scanning for DECISIONS.md files in ${cddDir}...`);
  
  const decisionsFiles = findDecisionsFiles(cddDir);
  console.log(`📊 Found ${decisionsFiles.length} work item(s)`);

  const items = [];
  let totalSessions = 0;
  let totalHours = 0;
  let totalReacquisitionMinutes = 0;
  let totalCompletedTasks = 0;
  let totalPlannedTasks = 0;

  for (const filePath of decisionsFiles) {
    const metrics = collectWorkItemMetrics(filePath);
    
    if (metrics) {
      items.push(metrics);
      totalSessions += metrics.total_sessions;
      totalHours += metrics.total_hours;
      totalReacquisitionMinutes += metrics.total_reacquisition_minutes;
      totalCompletedTasks += metrics.completed_tasks_total;
      totalPlannedTasks += metrics.planned_tasks_total;
      
      console.log(`  ✓ ${metrics.id.toString().padStart(4, '0')} - ${metrics.title} (${metrics.status})`);
    }
  }

  // Sort by ID
  items.sort((a, b) => a.id - b.id);

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      workItems: items.length,
      sessions: totalSessions,
      hours: Math.round(totalHours * 10) / 10,
      reacquisitionMinutes: totalReacquisitionMinutes,
      completedTasks: totalCompletedTasks,
      plannedTasks: totalPlannedTasks
    },
    averages: {
      sessionsPerWorkItem: items.length > 0 ? Math.round((totalSessions / items.length) * 10) / 10 : 0,
      hoursPerWorkItem: items.length > 0 ? Math.round((totalHours / items.length) * 10) / 10 : 0,
      reacquisitionPerSession: totalSessions > 0 ? Math.round((totalReacquisitionMinutes / totalSessions) * 10) / 10 : 0,
      sessionDuration: totalSessions > 0 ? Math.round((totalHours / totalSessions) * 10) / 10 : 0,
      completionRate: totalPlannedTasks > 0 ? Math.round((totalCompletedTasks / totalPlannedTasks) * 100) : 0
    },
    items
  };

  return summary;
}

/**
 * Generate metrics report in markdown format
 * @param {Object} summary - Aggregated metrics summary
 * @returns {string} - Markdown report
 */
function generateMarkdownReport(summary) {
  const lines = [];
  
  lines.push('# Metrics Summary Report');
  lines.push('');
  lines.push(`Generated: ${new Date(summary.generatedAt).toLocaleString()}`);
  lines.push('');
  lines.push('## Overall Totals');
  lines.push('');
  lines.push(`- **Work Items:** ${summary.totals.workItems}`);
  lines.push(`- **Total Sessions:** ${summary.totals.sessions}`);
  lines.push(`- **Total Hours:** ${summary.totals.hours}`);
  lines.push(`- **Total Reacquisition Time:** ${summary.totals.reacquisitionMinutes} minutes`);
  lines.push(`- **Tasks Completed:** ${summary.totals.completedTasks} / ${summary.totals.plannedTasks}`);
  lines.push('');
  lines.push('## Averages');
  lines.push('');
  lines.push(`- **Sessions per Work Item:** ${summary.averages.sessionsPerWorkItem}`);
  lines.push(`- **Hours per Work Item:** ${summary.averages.hoursPerWorkItem}`);
  lines.push(`- **Reacquisition per Session:** ${summary.averages.reacquisitionPerSession} minutes`);
  lines.push(`- **Session Duration:** ${summary.averages.sessionDuration} hours`);
  lines.push(`- **Overall Completion Rate:** ${summary.averages.completionRate}%`);
  lines.push('');
  lines.push('## Work Items');
  lines.push('');
  lines.push('| ID | Title | Status | Sessions | Hours | Tasks | Completion |');
  lines.push('|----|-------|--------|----------|-------|-------|------------|');
  
  for (const item of summary.items) {
    lines.push(
      `| ${item.id.toString().padStart(4, '0')} | ` +
      `${item.title} | ` +
      `${item.status} | ` +
      `${item.total_sessions} | ` +
      `${item.total_hours} | ` +
      `${item.completed_tasks_total}/${item.planned_tasks_total} | ` +
      `${item.completion_percentage}% |`
    );
  }
  
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Determine CDD directory (default: cdd/ in project root)
  // Script is in cdd/.meta/metrics/scripts/, so go up 4 levels to project root
  const projectRoot = path.resolve(__dirname, '../../../..');
  const cddDir = args[0] || path.join(projectRoot, 'cdd');
  
  if (!fs.existsSync(cddDir)) {
    console.error(`❌ CDD directory not found: ${cddDir}`);
    process.exit(1);
  }

  console.log('📈 CDD Metrics Collection');
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
  console.log(`Work Items: ${summary.totals.workItems}`);
  console.log(`Total Sessions: ${summary.totals.sessions}`);
  console.log(`Total Hours: ${summary.totals.hours}`);
  console.log(`Avg Reacquisition: ${summary.averages.reacquisitionPerSession} min/session`);
  console.log(`Completion Rate: ${summary.averages.completionRate}%`);
  console.log('');

  // Check for work items with data
  const itemsWithData = summary.items.filter(item => item.total_sessions > 0);
  if (itemsWithData.length === 0) {
    console.log('⚠️  No work items have session data yet.');
    console.log('   Run instrumented sessions and use /cdd:save-session to populate metrics.');
  } else {
    console.log(`✓ ${itemsWithData.length} work item(s) have session data.`);
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
  generateMarkdownReport
};

