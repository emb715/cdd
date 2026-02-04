#!/usr/bin/env node

/**
 * CDD CLI v2.0
 *
 * Command-line interface for Context-Driven Development v2
 *
 * Changes in v2:
 * - Simplified templates (single progressive template)
 * - Optional metrics (--track-metrics flag)
 * - Clean break from v1 (no migration support)
 *
 * Usage:
 *   npx @emb715/cdd init         - Initialize CDD v2 in current project
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
  console.log('🚀 Initializing CDD v2.0 in your project...\n');

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

    // Copy .meta/ folder (templates, metrics, etc.)
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
      'cdd:plan.md',
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

    // Create example structure (optional)
    console.log('\n📝 Creating example work item...');
    const exampleDir = path.join(cddDir, '0000-example');
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });

      // Copy example CONTEXT.md
      const exampleContext = path.join(metaDir, 'templates', 'v2', 'CONTEXT.md');
      const destContext = path.join(exampleDir, 'CONTEXT.md');

      if (fs.existsSync(exampleContext)) {
        let content = fs.readFileSync(exampleContext, 'utf8');
        content = content.replace('id: XXXX', 'id: 0000');
        content = content.replace('[Work Title]', 'Example Work Item');
        content = content.replace('YYYY-MM-DD', new Date().toISOString().split('T')[0]);
        fs.writeFileSync(destContext, content, 'utf8');
      }

      // Copy example SESSIONS.md
      const exampleSessions = path.join(metaDir, 'templates', 'v2', 'SESSIONS.md');
      const destSessions = path.join(exampleDir, 'SESSIONS.md');

      if (fs.existsSync(exampleSessions)) {
        let content = fs.readFileSync(exampleSessions, 'utf8');
        content = content.replace('XXXX-[work-name]', '0000-example');
        fs.writeFileSync(destSessions, content, 'utf8');
      }

      console.log('   ✓ 0000-example/ created (you can delete this)');
    }

    console.log('\n✅ CDD v2.0 initialized successfully!\n');
    console.log('━'.repeat(50));
    console.log('');
    console.log('📚 What\'s New in v2.0:');
    console.log('   • Single progressive template (no more modes!)');
    console.log('   • Unified CONTEXT.md (DECISIONS + IMPLEMENTATION_PLAN)');
    console.log('   • Multi-agent decision making (/cdd:plan)');
    console.log('   • Zero-ceremony logging (/cdd:log)');
    console.log('   • Optional metrics (--track-metrics flag)');
    console.log('');
    console.log('🚀 Quick Start:');
    console.log('   1. Check example: cdd/0000-example/CONTEXT.md');
    console.log('   2. Create work:   /cdd:start [description]');
    console.log('   3. Make progress: (code, code, code...)');
    console.log('   4. Log session:   /cdd:log');
    console.log('   5. Hard decision: /cdd:plan [topic]');
    console.log('   6. Finish:        /cdd:done');
    console.log('');
    console.log('📖 Documentation:');
    console.log('   • Templates:      cdd/.meta/templates/v2/');
    console.log('   • Commands:       .claude/commands/cdd:*');
    console.log('');
    console.log('💡 Pro tip: Metrics are opt-in now!');
    console.log('   Use --track-metrics only if you want data:');
    console.log('   /cdd:start my-feature --track-metrics');
    console.log('');
    console.log('━'.repeat(50));
    console.log('');
    console.log('Happy building! 🎉');
    console.log('');

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
CDD v2.0 - Context-Driven Development CLI

Usage:
  npx @emb715/cdd <command>

Commands:
  init              Initialize CDD v2.0 in your project
  version           Show version information
  help              Show this help message

Quick Start:
  npx @emb715/cdd init          # Set up CDD v2
  /cdd:start my-feature         # Create work item (in Claude)
  /cdd:log                      # Log session (in Claude)
  /cdd:plan "topic"             # Multi-agent decision (in Claude)
  /cdd:done                     # Mark complete (in Claude)

What's New in v2.0:
  • 70% less boilerplate
  • Single progressive template (no modes)
  • Multi-agent decision making
  • Zero-ceremony logging
  • Optional metrics (opt-in)
  • Unified CONTEXT.md file

Documentation:
  https://github.com/emb715/cdd
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
