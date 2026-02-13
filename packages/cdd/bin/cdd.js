#!/usr/bin/env node

/**
 * CDD CLI v1.0.0
 *
 * Command-line interface for Context-Driven Development
 *
 * Changes in v1.0.0 (First Stable Release):
 * - Sage agent integration for domain-aware decisions
 * - Honest agent integration for autonomous execution
 * - Command wrappers spawn specialized agents
 * - Instruction templates for agent-based workflows
 * - Single progressive template (removed complexity tiers)
 * - Complete metrics system removal
 * - 70% cleaner main conversation context
 *
 * Usage:
 *   npx @emb715/cdd init         - Initialize CDD in current project
 *   npx @emb715/cdd version      - Show version
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMANDS = {
  init: initCDD,
  version: showVersion,
  help: showHelp
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (!COMMANDS[command]) {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }

  await COMMANDS[command](args.slice(1));
}

async function initCDD(args) {
  console.log('🚀 Initializing CDD v1.0.0 in your project...\n');

  const cwd = process.cwd();
  const packageRoot = path.join(__dirname, '..');

  try {
    // Check if cdd/ already exists
    if (fs.existsSync(path.join(cwd, 'cdd'))) {
      console.log('⚠️  CDD directory already exists.');
      console.log('   This will overwrite existing CDD installation.\n');

      const answer = await prompt('Continue? (y/N): ');
      if (answer.toLowerCase() !== 'y') {
        console.log('   Cancelled.');
        process.exit(0);
      }
    }

    // Create cdd/ structure
    console.log('📁 Creating CDD workspace structure...');
    const cddDir = path.join(cwd, 'cdd');
    const metaDir = path.join(cddDir, '.meta');

    if (!fs.existsSync(cddDir)) {
      fs.mkdirSync(cddDir, { recursive: true });
    }

    // Copy .meta/ folder (templates, instructions, etc.)
    console.log('📋 Installing v2 templates...');
    const sourceMetaDir = path.join(packageRoot, 'cdd', '.meta');
    copyDir(sourceMetaDir, metaDir);
    console.log('   ✓ .meta/ folder created');

    // Install Claude commands
    console.log('\n🤖 Installing Claude commands...');
    const claudeDir = path.join(cwd, '.claude', 'commands');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    const commandsSource = path.join(packageRoot, '.claude', 'commands');
    const v2Commands = [
      'cdd:start.md',
      'cdd:log.md',
      'cdd:decide.md',
      'cdd:done.md'
    ];

    for (const cmdFile of v2Commands) {
      const sourcePath = path.join(commandsSource, cmdFile);
      const destPath = path.join(claudeDir, cmdFile);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`   ✓ ${cmdFile}`);
      }
    }

    // Install CDD agents
    console.log('\n🤖 Installing CDD agents...');
    const claudeAgentsDir = path.join(cwd, '.claude', 'agents');
    if (!fs.existsSync(claudeAgentsDir)) {
      fs.mkdirSync(claudeAgentsDir, { recursive: true });
    }

    const agentsSource = path.join(packageRoot, '.claude', 'agents');
    if (fs.existsSync(agentsSource)) {
      copyDir(agentsSource, claudeAgentsDir);
      console.log('   ✓ cdd-honest agent installed (v1.0.0)');
      console.log('   ✓ cdd-sage agent family installed (v1.0.0)');
      console.log('   📖 See AGENTS.md for usage guide');
    }

    // Create example structure (optional)
    console.log('\n📝 Creating example work item...');
    const exampleDir = path.join(cddDir, '0000-example');
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });

      // Copy example CONTEXT.md
      const exampleContext = path.join(metaDir, 'templates', 'CONTEXT.md');
      const destContext = path.join(exampleDir, 'CONTEXT.md');

      if (fs.existsSync(exampleContext)) {
        let content = fs.readFileSync(exampleContext, 'utf8');
        content = content.replace('id: XXXX', 'id: 0000');
        content = content.replace('[Work Title]', 'Example Work Item');
        content = content.replace('YYYY-MM-DD', new Date().toISOString().split('T')[0]);
        fs.writeFileSync(destContext, content, 'utf8');
      }

      // Copy example SESSIONS.md
      const exampleSessions = path.join(metaDir, 'templates', 'SESSIONS.md');
      const destSessions = path.join(exampleDir, 'SESSIONS.md');

      if (fs.existsSync(exampleSessions)) {
        let content = fs.readFileSync(exampleSessions, 'utf8');
        content = content.replace('XXXX-[work-name]', '0000-example');
        fs.writeFileSync(destSessions, content, 'utf8');
      }

      console.log('   ✓ 0000-example/ created (you can delete this)');
    }

    console.log('\n✅ CDD initialized\n');
    console.log('Workflow:');
    console.log('  /cdd:start [description]  - Create work item');
    console.log('  /cdd:log                  - Log progress');
    console.log('  /cdd:decide [topic]       - Multi-agent decision');
    console.log('  /cdd:done                 - Mark complete');
    console.log('\nExample: cdd/0000-example/CONTEXT.md');
    console.log('Docs: https://github.com/emb715/cdd\n');

  } catch (error) {
    console.error('\n❌ Error during initialization:', error.message);
    process.exit(1);
  }
}

function showVersion() {
  const packageJson = require(path.join(__dirname, '..', 'package.json'));
  console.log(`CDD v${packageJson.version}`);
  console.log('Context-Driven Development');
  console.log('https://github.com/emb715/cdd');
}

function showHelp() {
  console.log(`
CDD - Context-Driven Development

Usage:
  npx @emb715/cdd <command>

Commands:
  init      Initialize CDD in your project
  version   Show version
  help      Show this help

Workflow:
  /cdd:start [description]  - Create work item
  /cdd:log                  - Log progress
  /cdd:decide [topic]       - Multi-agent decision
  /cdd:done                 - Mark complete

Docs: https://github.com/emb715/cdd
`);
}

// Utility: Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Utility: Simple prompt
function prompt(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run main
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
