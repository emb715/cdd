#!/usr/bin/env node

/**
 * CDD CLI
 *
 * Command-line interface for Context-Driven Development
 *
 * Usage:
 *   npx @emb715/cdd init         - Initialize CDD in current project
 *   npx @emb715/cdd add rag      - Add RAG extension
 *   npx @emb715/cdd version      - Show version
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMANDS = {
  init: initCDD,
  add: addExtension,
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
  console.log('🚀 Initializing CDD in your project...\n');

  const cwd = process.cwd();
  const packageRoot = path.join(__dirname, '..');

  // Check if already initialized
  if (fs.existsSync(path.join(cwd, 'cdd'))) {
    console.log('⚠️  CDD already initialized in this project.');
    console.log('   cdd/ folder already exists.\n');

    const answer = await prompt('Overwrite existing files? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Initialization cancelled.');
      process.exit(0);
    }
  }

  try {
    // Copy cdd/ folder
    console.log('📁 Copying CDD workspace structure...');
    copyDir(path.join(packageRoot, 'cdd'), path.join(cwd, 'cdd'));
    console.log('   ✓ cdd/ folder created');

    // Copy .claude/commands/
    console.log('\n📁 Copying Claude commands...');
    const claudeDir = path.join(cwd, '.claude', 'commands');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    const commandsSource = path.join(packageRoot, '.claude', 'commands');
    const commandFiles = fs.readdirSync(commandsSource);

    commandFiles.forEach(file => {
      if (file.startsWith('cdd:')) {
        fs.copyFileSync(
          path.join(commandsSource, file),
          path.join(claudeDir, file)
        );
        console.log(`   ✓ ${file}`);
      }
    });

    console.log('\n✅ CDD initialized successfully!\n');
    console.log('📚 Next steps:');
    console.log('   1. Review cdd/.meta/README.md for full documentation');
    console.log('   2. See cdd/.meta/SIZING_GUIDE.md to choose your template mode');
    console.log('   3. Create your first work item:');
    console.log('      /cdd:create-work [description]\n');
    console.log('💡 Optional: Add RAG for semantic search');
    console.log('   npx @emb715/cdd add rag\n');

  } catch (error) {
    console.error('\n❌ Error during initialization:', error.message);
    process.exit(1);
  }
}

function addExtension(args) {
  const extension = args[0];

  if (!extension) {
    console.error('❌ Please specify an extension to add.');
    console.log('   Available extensions: rag');
    process.exit(1);
  }

  if (extension === 'rag') {
    addRAGExtension();
  } else {
    console.error(`❌ Unknown extension: ${extension}`);
    console.log('   Available extensions: rag');
    process.exit(1);
  }
}

function addRAGExtension() {
  console.log('🔍 Adding CDD-RAG extension...\n');

  const cwd = process.cwd();

  // Check if CDD is initialized
  if (!fs.existsSync(path.join(cwd, 'cdd'))) {
    console.error('❌ CDD not initialized in this project.');
    console.log('   Run: npx @emb715/cdd init\n');
    process.exit(1);
  }

  // Check if RAG package is available
  try {
    let ragPackagePath;

    // Strategy 1: Try to resolve from node_modules (if user has it installed)
    try {
      const ragPackageJson = require.resolve('@emb715/cdd-rag/package.json');
      ragPackagePath = path.dirname(ragPackageJson);
      console.log('📦 Found @emb715/cdd-rag in node_modules');
    } catch (resolveError) {
      // Strategy 2: Check monorepo structure (development mode)
      const monorepoPath = path.join(__dirname, '..', '..', 'cdd-rag');

      if (fs.existsSync(monorepoPath)) {
        ragPackagePath = monorepoPath;
        console.log('📦 Using local @emb715/cdd-rag (development mode)');
      } else {
        // Strategy 3: Download package using npm pack to temp directory
        console.log('📦 Downloading @emb715/cdd-rag from npm...');
        console.log('');

        const os = require('os');
        const tempDir = path.join(os.tmpdir(), 'cdd-rag-temp-' + Date.now());

        try {
          // Create temp directory
          fs.mkdirSync(tempDir, { recursive: true });

          // Use npm pack to download the package as tarball
          const packOutput = execSync('npm pack @emb715/cdd-rag', {
            cwd: tempDir,
            encoding: 'utf8'
          }).trim();

          const tarballPath = path.join(tempDir, packOutput);

          // Extract tarball
          execSync(`tar -xzf "${tarballPath}"`, { cwd: tempDir });

          // Package contents are in 'package/' subdirectory
          ragPackagePath = path.join(tempDir, 'package');

          if (!fs.existsSync(ragPackagePath)) {
            throw new Error('Package extraction failed');
          }

          console.log('✓ Package downloaded successfully');
          console.log('');
        } catch (downloadError) {
          console.error('❌ Failed to download @emb715/cdd-rag');
          console.log('');
          console.log('   Try manual installation:');
          console.log('   1. npm install -g @emb715/cdd-rag');
          console.log('   2. Or clone from GitHub');
          console.log('');
          process.exit(1);
        }
      }
    }

    // Copy RAG files
    console.log('📁 Copying RAG extension files...');

    const ragSource = path.join(ragPackagePath, 'cdd', '.rag');
    const ragDest = path.join(cwd, 'cdd', '.rag');

    if (!fs.existsSync(ragSource)) {
      console.error(`❌ RAG source not found: ${ragSource}`);
      console.log('   The package structure may be incorrect.');
      process.exit(1);
    }

    copyDir(ragSource, ragDest);
    console.log('   ✓ cdd/.rag/ created');

    // Copy RAG command
    const ragCommandSource = path.join(ragPackagePath, '.claude', 'commands', 'cdd:query.md');
    const ragCommandDest = path.join(cwd, '.claude', 'commands', 'cdd:query.md');

    fs.copyFileSync(ragCommandSource, ragCommandDest);
    console.log('   ✓ /cdd:query command added');

    console.log('\n✅ CDD-RAG extension added successfully!\n');
    console.log('📚 Next steps:');
    console.log('   1. Install Python dependencies:');
    console.log('      cd cdd/.rag && pip install -r requirements.txt');
    console.log('   2. (Optional) Configure AI features:');
    console.log('      cp cdd/.rag/.env.example cdd/.rag/.env');
    console.log('      # Add your OPENAI_API_KEY');
    console.log('   3. Index your CDD workspace:');
    console.log('      python -m cdd/.rag/core.cli index');
    console.log('   4. Try searching:');
    console.log('      /cdd:query "your search query"\n');
    console.log('📖 Full documentation: cdd/.rag/README.md\n');

  } catch (error) {
    console.error('\n❌ Error adding RAG extension:', error.message);
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
CDD - Context-Driven Development CLI

Usage:
  npx @emb715/cdd <command> [options]

Commands:
  init              Initialize CDD in your project
  add <extension>   Add an extension (e.g., rag)
  version           Show version information
  help              Show this help message

Examples:
  npx @emb715/cdd init          # Set up CDD in current project
  npx @emb715/cdd add rag       # Add RAG extension for semantic search

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

// Utility: Simple prompt (for Node.js compatibility)
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
