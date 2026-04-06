#!/usr/bin/env node

/**
 * CDD CLI
 *
 * Usage:
 *   npx @emb715/cdd init                        - Initialize CDD (interactive platform selection)
 *   npx @emb715/cdd init --platform=claude-code  - Initialize for specific platform
 *   npx @emb715/cdd version                      - Show version
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Platform definitions
// ---------------------------------------------------------------------------

const PLATFORMS = {
  "claude-code": {
    key: "claude-code",
    name: "Claude Code",
    commandsDir: ".claude/commands",
    agentsDir: ".claude/agents",
    hooksDir: ".claude/hooks",
    skillsDir: ".claude/skills/cdd-workflow",
    instructionsFile: "CLAUDE.md",
    commandFormat: "md",
    supportsAgents: true,    // has agent directory
    supportsHooks: true,
    supportsSkills: true,
    supportsTaskTool: true,  // Claude Code Task tool + subagent protocol
  },
  opencode: {
    key: "opencode",
    name: "OpenCode",
    commandsDir: ".opencode/commands",
    agentsDir: ".opencode/agents",
    hooksDir: null,
    pluginsDir: ".opencode/plugins",
    skillsDir: null,
    instructionsFile: "AGENTS.md",
    commandFormat: "md",
    supportsAgents: true,    // has agent directory
    supportsHooks: false,
    supportsPlugins: true,   // OpenCode plugin system (replaces hooks)
    supportsSkills: false,
    supportsTaskTool: true,  // OpenCode Task tool + subagent protocol
  },
  copilot: {
    key: "copilot",
    name: "GitHub Copilot",
    commandsDir: ".github/prompts",
    agentsDir: null,
    hooksDir: null,
    skillsDir: null,
    instructionsFile: ".github/copilot-instructions.md",
    commandFormat: "prompt.md",
    supportsAgents: false,
    supportsHooks: false,
    supportsSkills: false,
    supportsTaskTool: false,
  },
  vscode: {
    key: "vscode",
    name: "VSCode Extension",
    commandsDir: ".github/prompts",
    agentsDir: null,
    hooksDir: null,
    skillsDir: null,
    instructionsFile: ".github/copilot-instructions.md",
    commandFormat: "prompt.md",
    supportsAgents: false,
    supportsHooks: false,
    supportsSkills: false,
    supportsTaskTool: false,
  },
};

// ---------------------------------------------------------------------------
// Transform pipeline
// ---------------------------------------------------------------------------

/**
 * Strip Task tool / subagent delegation sections from command content.
 *
 * Strategy: remove entire step sections that are agent-delegation steps
 * (identified by heading keywords), plus any trailing "Task configuration"
 * blocks and agent-reference sentences outside code blocks.
 */
function stripAgentBlocks(content) {
  let out = content;

  // 1. Remove "**Agent prompt:**" blocks including the fenced code block that follows
  out = out.replace(/\*\*Agent prompt:\*\*\s*\n```[\s\S]*?```\s*\n/g, "");

  // 2. Remove "**Task configuration:**" blocks (bullet list + following blank line)
  out = out.replace(/\*\*Task configuration:\*\*[\s\S]*?(?=\n\n\S|\n###|\n##|$)/g, "");

  // 3. Remove step headings that are agent-delegation steps and replace with direct-execute heading
  //    Matches: ### Step N: Launch ... / ### Step N: Spawn ...
  out = out.replace(/### Step (\d+): (?:Launch|Spawn)[^\n]+/g, "### Step $1: Execute the following steps directly:");

  // 4. Remove "Use Task tool..." prose lines
  out = out.replace(/^Use Task tool[^\n]*\n/gm, "");

  // 5. Remove "Spawn Task..." / "Spawn N..." prose lines
  out = out.replace(/^Spawn (?:Task|\d+)[^\n]*\n/gm, "");

  // 6. Remove **Execution:** parallel lines
  out = out.replace(/^\*\*Execution:\*\*[^\n]*\n/gm, "");

  // 7. Remove "Main conversation stays clean..." lines
  out = out.replace(/^Main conversation stays clean\.[^\n]*\n/gm, "");

  // 8. Remove prose lines that mention specific agent names
  out = out.replace(/^[^\n]*\b(?:cdd-honest|cdd-sage[\w-]*|cdd-victor-reid)\b[^\n]*\n/gm, "");

  // 9. Remove "The [X] agent ..." sentences that are now dangling
  out = out.replace(/^The \w+ agent[^\n]*\n/gm, "");

  // 10. Remove "Wait for both agents..." lines
  out = out.replace(/^Wait for (?:both|all) agents[^\n]*\n/gm, "");

  // 11. Remove "Present the [X] agent's output..." lines — becomes "Present output to user."
  out = out.replace(/^Present (?:the \w+ agent's|agent's)[^\n]*\n/gm, "Present output to user without modification.\n");

  // 12. Remove timing lines
  out = out.replace(/^Estimated time:[^\n]*\n/gm, "");

  // 13. Collapse 3+ blank lines → 2
  out = out.replace(/\n{3,}/g, "\n\n");

  return out;
}

/**
 * Strip Stop hook / settings.json / .resume references.
 */
function stripHookReferences(content) {
  let out = content;

  // Remove entire "## Stop Hook Setup" section
  out = out.replace(/^## Stop Hook Setup[\s\S]*?(?=^##|\Z)/m, "");

  // Remove individual hook reference lines
  out = out.replace(/^.*settings\.json.*\n/gm, "");
  out = out.replace(/^.*\.resume.*\n/gm, "");
  out = out.replace(/^.*Stop hook.*\n/gm, "");
  out = out.replace(/^.*cdd-loop-resume\.sh.*\n/gm, "");

  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

/**
 * Ensure frontmatter has `name` and `description` fields required by Copilot .prompt.md.
 * Strips extra CDD-specific fields (author, version).
 */
function normalizeFrontmatter(content, commandName) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    // No frontmatter — prepend minimal one
    return `---\nname: ${commandName}\ndescription: CDD ${commandName} command\n---\n\n${content}`;
  }

  const fmBody = fmMatch[1];
  const descMatch = fmBody.match(/^description:\s*(.+)$/m);
  const description = descMatch ? descMatch[1].trim() : `CDD ${commandName} command`;

  const newFm = `---\nname: ${commandName}\ndescription: ${description}\n---`;
  return content.replace(/^---\n[\s\S]*?\n---/, newFm);
}

/**
 * Build a stub for cdd:loop on platforms that don't support the Task tool.
 */
function buildLoopStub(platform) {
  const ext = platform.commandFormat === "prompt.md" ? "prompt.md" : "md";
  const frontmatter =
    ext === "prompt.md"
      ? `---\nname: cdd-loop\ndescription: Full-cycle orchestrator (requires Claude Code)\n---\n\n`
      : `---\ndescription: Full-cycle orchestrator (requires Claude Code)\n---\n\n`;

  return (
    frontmatter +
    `# /cdd:loop

Not available on ${platform.name}. This command requires Claude Code's Task tool and sub-agent system.

Manual equivalent:
1. Read _cdd/[work-id]/CONTEXT.md for pending tasks
2. Work through tasks sequentially
3. Run /cdd:log after each session
4. Run /cdd:done when all tasks complete
`
  );
}

/**
 * Strip the Stop Hook Setup section and .resume file writes from cdd:loop
 * for OpenCode. The plugin handles compaction-based resume instead.
 * Adds a note that context survival is handled by the CDD plugin.
 */
function stripLoopHookSection(content) {
  let out = content;

  // Remove entire "## Stop Hook Setup" section
  out = out.replace(/^## Stop Hook Setup[\s\S]*?(?=^---|\Z)/m, "");

  // Remove the .resume write step inside CHECK ROTATION
  // Matches the numbered step that writes .resume (single line or multi-line block)
  out = out.replace(/^.*Write _cdd\/\[work-id\]\/.loop\/\.resume.*\n/gm, "");
  out = out.replace(/^\s*```\n\s*\/cdd:loop \[work-id\] --resume\n\s*```\n/gm, "");

  // Remove "Do NOT write .resume" references (SOFT STOP / HARD STOP sections)
  out = out.replace(/^.*Do NOT write \.resume[^\n]*\n/gm, "");

  // Remove any remaining standalone .resume references in prose
  out = out.replace(/^.*\.resume.*Stop hook.*\n/gm, "");
  // Replace the inline emit message line referencing Stop hook (inside code block)
  out = out.replace(
    /^(\s*)\(Stop hook auto-resumes if configured[^\n]*\)\n/gm,
    "$1(CDD plugin handles compaction — loop continues automatically)\n"
  );

  // Add plugin note after the Orchestrator Rules section
  const pluginNote = `\n> **OpenCode:** Context compaction is handled automatically by the CDD plugin.\n> The loop resumes within the same session without human input.\n`;
  out = out.replace(
    /(## Orchestrator Rules \(Hard\)\n[\s\S]*?)(---)/,
    `$1${pluginNote}\n---`
  );

  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

/**
 * Convert Claude agent frontmatter to OpenCode format.
 * Injects `mode: subagent` so OpenCode recognises these as Task-tool-invokable agents.
 */
function convertAgentFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return content;

  const fmBody = fmMatch[1];

  // Already has mode field — leave it alone
  if (/^mode:/m.test(fmBody)) return content;

  // Inject mode: subagent after description line (or at end of frontmatter)
  const newFmBody = fmBody.replace(
    /^(description:.*)$/m,
    "$1\nmode: subagent"
  );

  return content.replace(/^---\n[\s\S]*?\n---/, `---\n${newFmBody}\n---`);
}

/**
 * Apply full transform pipeline to a command file's content.
 */
function transformCommand(content, commandName, platform) {
  let out = content;

  // Strip Claude-specific Task tool / subagent blocks for platforms that don't support them
  if (!platform.supportsTaskTool) {
    out = stripAgentBlocks(out);
    out = stripHookReferences(out);
  }

  // For OpenCode: strip Stop Hook section from cdd:loop (plugin handles it instead)
  if (platform.key === "opencode" && commandName === "cdd:loop") {
    out = stripLoopHookSection(out);
  }

  if (platform.commandFormat === "prompt.md") {
    out = normalizeFrontmatter(out, commandName);
  }

  return out;
}

// ---------------------------------------------------------------------------
// Installer helpers
// ---------------------------------------------------------------------------

function installCommands(platform, cwd, packageRoot) {
  console.log(`\nInstalling commands for ${platform.name}...`);

  const sourceDir = path.join(packageRoot, "_cdd", ".meta", "commands");
  const destDir = path.join(cwd, platform.commandsDir);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Source files use dash (Windows-safe). Output files use colon (platform convention).
  // e.g. cdd-start.md (source) → cdd:start.md (installed)
  const commandFiles = [
    "cdd-start.md",
    "cdd-log.md",
    "cdd-decide.md",
    "cdd-done.md",
    "cdd-scope.md",
    "cdd-loop.md",
    "cdd-catch.md",
  ];

  // Validate no source file contains ':' — catches regressions on Windows-hostile names
  for (const cmdFile of commandFiles) {
    if (cmdFile.includes(":")) {
      console.warn(`   WARNING: source file "${cmdFile}" contains ':' — will fail on Windows`);
    }
  }

  for (const cmdFile of commandFiles) {
    // Derive the slash-command name: cdd-start.md → cdd:start
    const commandName = cmdFile.replace(/\.md$/, "").replace(/^cdd-/, "cdd:");
    const isLoop = commandName === "cdd:loop";
    const destExt = platform.commandFormat === "prompt.md" ? "prompt.md" : "md";
    const destName = `${commandName}.${destExt}`;
    const destPath = path.join(destDir, destName);

    if (isLoop && !platform.supportsTaskTool) {
      fs.writeFileSync(destPath, buildLoopStub(platform), "utf8");
      console.log(`   ✓ ${destName} (stub — requires Claude Code)`);
      continue;
    }

    const sourcePath = path.join(sourceDir, cmdFile);
    if (!fs.existsSync(sourcePath)) {
      console.log(`   - ${cmdFile} (source not found, skipped)`);
      continue;
    }

    const raw = fs.readFileSync(sourcePath, "utf8");
    const transformed = transformCommand(raw, commandName, platform);
    fs.writeFileSync(destPath, transformed, "utf8");
    console.log(`   ✓ ${destName}`);
  }
}

function installAgents(platform, cwd, packageRoot) {
  console.log(`\nInstalling agents for ${platform.name}...`);

  const sourceDir = path.join(packageRoot, "_cdd", ".meta", "agents");
  const destDir = path.join(cwd, platform.agentsDir);

  if (!fs.existsSync(sourceDir)) return;

  // For OpenCode: convert agent frontmatter (inject mode: subagent)
  // For Claude Code: copy verbatim
  if (platform.key === "opencode") {
    copyDirWithTransform(sourceDir, destDir, convertAgentFrontmatter);
  } else {
    copyDir(sourceDir, destDir);
  }

  console.log("   ✓ cdd-honest (autonomous execution)");
  console.log("   ✓ cdd-sage family (domain-aware decisions)");
  console.log("   ✓ cdd-victor-reid (rigorous code review for /cdd:loop)");
}

function installPlugins(platform, cwd, packageRoot) {
  console.log(`\nInstalling plugins for ${platform.name}...`);

  const pluginsDir = path.join(cwd, platform.pluginsDir);
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }

  const pluginSrc = path.join(packageRoot, "_cdd", ".meta", "plugins", "cdd-loop-resume.ts");
  const pluginDst = path.join(pluginsDir, "cdd-loop-resume.ts");

  if (fs.existsSync(pluginSrc)) {
    fs.copyFileSync(pluginSrc, pluginDst);
    console.log("   ✓ cdd-loop-resume.ts (compaction hook — keeps /cdd:loop alive across context limits)");
  }
}

function installHooks(platform, cwd, packageRoot) {
  console.log(`\nInstalling hooks for ${platform.name}...`);

  const hooksDir = path.join(cwd, platform.hooksDir);
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookSrc = path.join(packageRoot, "_cdd", ".meta", "hooks", "cdd-loop-resume.sh");
  const hookDst = path.join(hooksDir, "cdd-loop-resume.sh");

  if (fs.existsSync(hookSrc)) {
    fs.copyFileSync(hookSrc, hookDst);
    fs.chmodSync(hookDst, "755");
    console.log("   ✓ cdd-loop-resume.sh (Stop hook for /cdd:loop auto-resume)");
  }
}

function installSkills(platform, cwd, packageRoot) {
  console.log(`\nInstalling skills for ${platform.name}...`);

  const skillsDir = path.join(cwd, platform.skillsDir);
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  const skillSrc = path.join(packageRoot, "_cdd", ".meta", "skills", "cdd-workflow", "SKILL.md");
  const skillDst = path.join(skillsDir, "SKILL.md");

  if (fs.existsSync(skillSrc)) {
    fs.copyFileSync(skillSrc, skillDst);
    console.log("   ✓ cdd-workflow skill (CDD workflow awareness)");
  }
}

function installInstructions(platform, cwd) {
  const instructionsPath = path.join(cwd, platform.instructionsFile);
  const cddSection = `\n## CDD (Context-Driven Development)\n\nInstalled. Work items in \`_cdd/\`. Commands: \`/cdd:start\`, \`/cdd:loop\`, \`/cdd:log\`, \`/cdd:decide\`, \`/cdd:scope\`, \`/cdd:done\`.\n\nActive work: check \`_cdd/*/STATUS.md\` for current state.\n`;

  // Ensure parent directory exists (e.g. .github/)
  const parentDir = path.dirname(instructionsPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  if (!fs.existsSync(instructionsPath)) {
    fs.writeFileSync(instructionsPath, `# Project\n${cddSection}`, "utf8");
    console.log(`\n   ✓ ${platform.instructionsFile} created with CDD section`);
  } else {
    const existing = fs.readFileSync(instructionsPath, "utf8");
    if (!existing.includes("CDD (Context-Driven Development)")) {
      fs.appendFileSync(instructionsPath, cddSection);
      console.log(`\n   ✓ ${platform.instructionsFile} updated with CDD section`);
    } else {
      console.log(`\n   ✓ ${platform.instructionsFile} already has CDD section (skipped)`);
    }
  }
}

function printFeatureTable(platform) {
  const ok = "[OK]";
  const no = "[--]";

  console.log(`\nCDD initialized for ${platform.name}\n`);
  console.log("Feature availability:");
  console.log(`  ${ok} Commands (/cdd:start, /cdd:loop, /cdd:log, /cdd:decide, /cdd:scope, /cdd:done, /cdd:catch)`);
  console.log(`  ${platform.supportsAgents ? ok : no} Agents${platform.supportsAgents ? " (cdd-honest, cdd-sage family, cdd-victor-reid)" : ": not supported by " + platform.name}`);
  console.log(`  ${platform.supportsHooks ? ok : no} Hooks${platform.supportsHooks ? " (cdd-loop auto-resume on context rotation)" : ": not supported by " + platform.name}`);
  console.log(`  ${platform.supportsPlugins ? ok : no} Plugins${platform.supportsPlugins ? " (cdd-loop-resume — survives context compaction)" : ": not supported by " + platform.name}`);
  console.log(`  ${platform.supportsSkills ? ok : no} Skills${platform.supportsSkills ? " (cdd-workflow auto-trigger)" : ": not supported by " + platform.name}`);

  if (!platform.supportsAgents) {
    console.log("\nNote: /cdd:loop parallel task execution and auto-resume require Claude Code.");
  }
}

// ---------------------------------------------------------------------------
// Platform selection
// ---------------------------------------------------------------------------

async function selectPlatform() {
  const choices = [
    { key: "claude-code", label: "Claude Code       (full support: commands, agents, hooks, skills)" },
    { key: "opencode",    label: "OpenCode          (commands + agents + /cdd:loop via plugin)" },
    { key: "copilot",     label: "GitHub Copilot    (commands only)" },
    { key: "vscode",      label: "VSCode Extension  (commands only)" },
  ];

  console.log("Which AI coding platform are you using?\n");
  choices.forEach((c, i) => console.log(`  ${i + 1}) ${c.label}`));
  console.log("");

  const answer = await prompt("Enter number (1-4): ");
  const index = parseInt(answer.trim(), 10) - 1;

  if (index < 0 || index >= choices.length || isNaN(index)) {
    console.error("Invalid selection. Defaulting to Claude Code.");
    return "claude-code";
  }

  return choices[index].key;
}

// ---------------------------------------------------------------------------
// Legacy cleanup
// ---------------------------------------------------------------------------

function cleanupLegacy(cwd) {
  console.log("\nCleaning up legacy files...");

  const legacyFiles = [
    // v0.x / v1.x command names
    ".claude/commands/cdd:create-work.md",
    ".claude/commands/cdd:plan-work.md",
    ".claude/commands/cdd:save-session.md",
    ".claude/commands/cdd:complete-work.md",
    ".claude/commands/cdd:list-work.md",
    // v1.x meta artifacts
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

// ---------------------------------------------------------------------------
// Main init
// ---------------------------------------------------------------------------

async function initCDD(args) {
  const packageJson = require(path.join(__dirname, "..", "package.json"));
  console.log(`Initializing CDD v${packageJson.version} in your project...\n`);

  const cwd = process.cwd();
  const packageRoot = path.join(__dirname, "..");

  // Resolve platform
  const platformArg = args.find((a) => a.startsWith("--platform="));
  const platformKey = platformArg ? platformArg.split("=")[1] : await selectPlatform();
  const platform = PLATFORMS[platformKey];

  if (!platform) {
    console.error(`Unknown platform: "${platformKey}". Valid options: ${Object.keys(PLATFORMS).join(", ")}`);
    process.exit(1);
  }

  try {
    // Handle existing installation
    if (fs.existsSync(path.join(cwd, "_cdd"))) {
      console.log("CDD directory already exists.");
      console.log("This will overwrite existing CDD installation.\n");

      const answer = await prompt("Continue? (y/N): ");
      if (answer.toLowerCase() !== "y") {
        console.log("Cancelled.");
        process.exit(0);
      }

      cleanupLegacy(cwd);
    }

    // Create _cdd/ workspace structure
    console.log("\nCreating CDD workspace structure...");
    const cddDir = path.join(cwd, "_cdd");
    const metaDir = path.join(cddDir, ".meta");
    const sourceMetaDir = path.join(packageRoot, "_cdd", ".meta");

    fs.mkdirSync(metaDir, { recursive: true });
    fs.mkdirSync(path.join(metaDir, "templates"), { recursive: true });
    fs.mkdirSync(path.join(metaDir, "templates", "decisions"), { recursive: true });
    fs.mkdirSync(path.join(metaDir, "instructions"), { recursive: true });
    fs.mkdirSync(path.join(cddDir, "scope"), { recursive: true });
    fs.mkdirSync(path.join(cddDir, "gotchas"), { recursive: true });
    fs.writeFileSync(path.join(cddDir, "gotchas", ".gitkeep"), "");

    // Copy essential meta files
    console.log("Installing templates and instructions...");
    const essentialFiles = [
      "templates/CONTEXT.md",
      "templates/SESSIONS.md",
      "templates/SCOPE_PLAN.md",
      "templates/STATUS.md",
      "templates/decisions/DECISION_TEMPLATE.md",
      "instructions/start.md",
      "instructions/plan.md",
      "instructions/log.md",
      "instructions/done.md",
      "instructions/scope.md",
      "instructions/catch.md",
      "templates/GOTCHA_TEMPLATE.md",
      "loop.config.yaml",
    ];

    for (const file of essentialFiles) {
      const sourcePath = path.join(sourceMetaDir, file);
      const destPath = path.join(metaDir, file);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    }

    console.log("   ✓ CONTEXT.md template");
    console.log("   ✓ SESSIONS.md template");
    console.log("   ✓ SCOPE_PLAN.md template");
    console.log("   ✓ STATUS.md template");
    console.log("   ✓ DECISION_TEMPLATE.md");
    console.log("   ✓ Agent instruction files");
    console.log("   ✓ GOTCHA_TEMPLATE.md");
    console.log("   ✓ loop.config.yaml");

    // Platform-specific install
    installCommands(platform, cwd, packageRoot);

    if (platform.supportsAgents) installAgents(platform, cwd, packageRoot);
    if (platform.supportsHooks)   installHooks(platform, cwd, packageRoot);
    if (platform.supportsPlugins) installPlugins(platform, cwd, packageRoot);
    if (platform.supportsSkills)  installSkills(platform, cwd, packageRoot);

    installInstructions(platform, cwd);

    // Example work item
    console.log("\nCreating example work item...");
    const exampleDir = path.join(cddDir, "0000-example");
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });

      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      const timeStr = today.toTimeString().slice(0, 5);

      const exampleContext = path.join(metaDir, "templates", "CONTEXT.md");
      if (fs.existsSync(exampleContext)) {
        let content = fs.readFileSync(exampleContext, "utf8");
        content = content.replace("id: XXXX", "id: 0000")
          .replace("[Work Title]", "Example Work Item")
          .replace("YYYY-MM-DD", dateStr);
        fs.writeFileSync(path.join(exampleDir, "CONTEXT.md"), content, "utf8");
      }

      const exampleSessions = path.join(metaDir, "templates", "SESSIONS.md");
      if (fs.existsSync(exampleSessions)) {
        let content = fs.readFileSync(exampleSessions, "utf8");
        content = content.replace("XXXX-[work-name]", "0000-example");
        fs.writeFileSync(path.join(exampleDir, "SESSIONS.md"), content, "utf8");
      }

      const exampleStatus = path.join(metaDir, "templates", "STATUS.md");
      if (fs.existsSync(exampleStatus)) {
        let content = fs.readFileSync(exampleStatus, "utf8");
        content = content
          .replace("XXXX-work-name", "0000-example")
          .replace("YYYY-MM-DD HH:MM", `${dateStr} ${timeStr}`);
        fs.writeFileSync(path.join(exampleDir, "STATUS.md"), content, "utf8");
      }

      console.log("   ✓ 0000-example/ created (you can delete this)");
    }

    printFeatureTable(platform);

    console.log("\nWorkflow:");
    console.log("  /cdd:scope [brief]        - Scope large work");
    console.log("  /cdd:start [description]  - Create work item");
    console.log("  /cdd:loop [work-id]       - Full-cycle orchestration (Claude Code only)");
    console.log("  /cdd:log                  - Save session");
    console.log("  /cdd:decide [topic]       - Multi-agent decision");
    console.log("  /cdd:done                 - Mark complete");
    console.log("\nNext: Check _cdd/0000-example/CONTEXT.md");
    console.log("Docs: https://github.com/emb715/cdd\n");
  } catch (error) {
    console.error("\nError during initialization:", error.message);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

const COMMANDS = {
  init: initCDD,
  version: showVersion,
  help: showHelp,
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  if (!COMMANDS[command]) {
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }

  await COMMANDS[command](args.slice(1));
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
  npx @emb715/cdd <command> [options]

Commands:
  init [--platform=<platform>]   Initialize CDD in your project
  version                        Show version
  help                           Show this help

Platforms:
  claude-code   Full support (commands, agents, hooks, skills)
  opencode      Commands + agents
  copilot       Commands only
  vscode        Commands only

Docs: https://github.com/emb715/cdd
`);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyDirWithTransform(src, dest, transformFn) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirWithTransform(srcPath, destPath, transformFn);
    } else if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(srcPath, "utf8");
      fs.writeFileSync(destPath, transformFn(raw), "utf8");
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

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

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
