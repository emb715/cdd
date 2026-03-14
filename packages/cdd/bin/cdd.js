#!/usr/bin/env node

/**
 * CDD CLI v1.0.0
 *
 * Command-line interface for Context-Driven Development
 *
 * Zero Ceremony Approach:
 * - Single progressive template (CONTEXT.md) - no multi-tier complexity
 * - Minimal session log (SESSIONS.md) - no mandatory tracking
 * - 4 commands: start, log, decide, done - no ceremony overhead
 * - Honest agent for autonomous execution - no questions
 * - Sage agents for multi-agent decisions - humans decide, AI researches
 * - No metrics system - zero overhead
 * - LLM-optimized commands - minimal tokens
 *
 * Usage:
 *   npx @emb715/cdd init         - Initialize CDD in current project
 *   npx @emb715/cdd version      - Show version
 */

const fs = require("fs");
const path = require("path");

const COMMANDS = {
  init: initCDD,
  version: showVersion,
  help: showHelp,
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  if (!COMMANDS[command]) {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }

  await COMMANDS[command](args.slice(1));
}

async function initCDD(args) {
  const packageJson = require(path.join(__dirname, "..", "package.json"));
  console.log(
    `Initializing CDD v${packageJson.version} (Zero Ceremony) in your project...\n`,
  );

  const cwd = process.cwd();
  const packageRoot = path.join(__dirname, "..");

  try {
    // Check if _cdd/ already exists
    if (fs.existsSync(path.join(cwd, "_cdd"))) {
      console.log("⚠️  CDD directory already exists.");
      console.log("   This will overwrite existing CDD installation.\n");

      const answer = await prompt("Continue? (y/N): ");
      if (answer.toLowerCase() !== "y") {
        console.log("   Cancelled.");
        process.exit(0);
      }

      // Clean up legacy files from v0.x/v1.x
      console.log("\n🧹 Cleaning up legacy files...");
      const legacyFiles = [
        ".claude/commands/cdd:create-work.md",
        ".claude/commands/cdd:plan-work.md",
        ".claude/commands/cdd:save-session.md",
        ".claude/commands/cdd:complete-work.md",
        ".claude/commands/cdd:list-work.md",
        "_cdd/.meta/metrics",
        "_cdd/.meta/metrics-summary.json",
        "_cdd/.meta/metrics-summary.md",
        "_cdd/.meta/QUICK_REFERENCE.md",
      ];

      for (const file of legacyFiles) {
        const fullPath = path.join(cwd, file);
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
          console.log(`   ✓ Removed: ${file}`);
        }
      }
    }

    // Create _cdd/ structure
    console.log("Creating CDD workspace structure...");
    const cddDir = path.join(cwd, "_cdd");
    const metaDir = path.join(cddDir, ".meta");

    if (!fs.existsSync(cddDir)) {
      fs.mkdirSync(cddDir, { recursive: true });
    }

    // Copy .meta/ folder (templates and instructions only - zero ceremony)
    console.log("Installing templates and instructions...");
    const sourceMetaDir = path.join(packageRoot, "_cdd", ".meta");

    // Create .meta structure
    fs.mkdirSync(metaDir, { recursive: true });
    fs.mkdirSync(path.join(metaDir, "templates"), { recursive: true });
    fs.mkdirSync(path.join(metaDir, "templates", "decisions"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(metaDir, "instructions"), { recursive: true });
    fs.mkdirSync(path.join(cddDir, "scope"), { recursive: true });

    // Copy ONLY the essential v2 templates (zero ceremony)
    const essentialFiles = [
      "templates/CONTEXT.md",
      "templates/SESSIONS.md",
      "templates/SCOPE_PLAN.md",
      "templates/decisions/DECISION_TEMPLATE.md",
      "instructions/start.md",
      "instructions/log.md",
      "instructions/done.md",
      "instructions/scope.md",
      "loop.config.yaml",
    ];

    for (const file of essentialFiles) {
      const sourcePath = path.join(sourceMetaDir, file);
      const destPath = path.join(metaDir, file);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    }

    console.log("   ✓ CONTEXT.md template (progressive, single file)");
    console.log("   ✓ SESSIONS.md template (minimal logging)");
    console.log("   ✓ SCOPE_PLAN.md template (for /cdd:scope)");
    console.log("   ✓ DECISION_TEMPLATE.md (for /cdd:decide)");
    console.log("   ✓ Agent instruction files (start, log, done, scope)");
    console.log("   ✓ loop.config.yaml (orchestrator config for /cdd:loop)");

    // Install Claude commands
    console.log("\n Installing Claude commands...");
    const claudeDir = path.join(cwd, ".claude", "commands");
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    const commandsSource = path.join(packageRoot, ".claude", "commands");
    const v2Commands = [
      "cdd:start.md",
      "cdd:log.md",
      "cdd:decide.md",
      "cdd:done.md",
      "cdd:scope.md",
      "cdd:loop.md",
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
    console.log("\n Installing CDD agents...");
    const claudeAgentsDir = path.join(cwd, ".claude", "agents");
    if (!fs.existsSync(claudeAgentsDir)) {
      fs.mkdirSync(claudeAgentsDir, { recursive: true });
    }

    const agentsSource = path.join(packageRoot, ".claude", "agents");
    if (fs.existsSync(agentsSource)) {
      copyDir(agentsSource, claudeAgentsDir);
      console.log("   ✓ cdd-honest (autonomous execution)");
      console.log("   ✓ cdd-sage family (domain-aware decisions)");
      console.log("   ✓ cdd-victor-reid (rigorous code review for /cdd:loop)");
    }

    // Install loop resume hook
    console.log("\n Installing CDD hooks...");
    const hooksDir = path.join(cwd, ".claude", "hooks");
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    const hookSrc = path.join(packageRoot, ".claude", "hooks", "cdd-loop-resume.sh");
    const hookDst = path.join(hooksDir, "cdd-loop-resume.sh");
    if (fs.existsSync(hookSrc)) {
      fs.copyFileSync(hookSrc, hookDst);
      fs.chmodSync(hookDst, "755");
      console.log("   ✓ cdd-loop-resume.sh (Stop hook for /cdd:loop auto-resume)");
    }

    // Create example structure (optional)
    console.log("\n Creating example work item...");
    const exampleDir = path.join(cddDir, "0000-example");
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });

      // Copy example CONTEXT.md
      const exampleContext = path.join(metaDir, "templates", "CONTEXT.md");
      const destContext = path.join(exampleDir, "CONTEXT.md");

      if (fs.existsSync(exampleContext)) {
        let content = fs.readFileSync(exampleContext, "utf8");
        content = content.replace("id: XXXX", "id: 0000");
        content = content.replace("[Work Title]", "Example Work Item");
        content = content.replace(
          "YYYY-MM-DD",
          new Date().toISOString().split("T")[0],
        );
        fs.writeFileSync(destContext, content, "utf8");
      }

      // Copy example SESSIONS.md
      const exampleSessions = path.join(metaDir, "templates", "SESSIONS.md");
      const destSessions = path.join(exampleDir, "SESSIONS.md");

      if (fs.existsSync(exampleSessions)) {
        let content = fs.readFileSync(exampleSessions, "utf8");
        content = content.replace("XXXX-[work-name]", "0000-example");
        fs.writeFileSync(destSessions, content, "utf8");
      }

      console.log("   ✓ 0000-example/ created (you can delete this)");
    }

    console.log("\n CDD initialized (Zero Ceremony)\n");
    console.log("Zero Ceremony Workflow:");
    console.log(
      "  /cdd:scope [brief]        - Scope large work (greenfield, epics, sprints)",
    );
    console.log(
      "  /cdd:start [description]  - Create work item (30 sec, not 10 min)",
    );
    console.log("  /cdd:loop [work-id]       - Full-cycle orchestration with auto-review");
    console.log("  /cdd:log                  - Save session (minimal logging)");
    console.log(
      "  /cdd:decide [topic]       - Multi-agent decision (you decide, AI researches)",
    );
    console.log("  /cdd:done                 - Mark complete (evidence-based)");
    console.log(
      "\nPhilosophy: Speed over perfection. Humans decide, AI assists.",
    );
    console.log("\nNext: Check _cdd/0000-example/CONTEXT.md");
    console.log("Docs: https://github.com/emb715/cdd\n");
  } catch (error) {
    console.error("\n❌ Error during initialization:", error.message);
    process.exit(1);
  }
}

function showVersion() {
  const packageJson = require(path.join(__dirname, "..", "package.json"));
  console.log(`CDD v${packageJson.version}`);
  console.log("Context-Driven Development");
  console.log("https://github.com/emb715/cdd");
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
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run main
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
