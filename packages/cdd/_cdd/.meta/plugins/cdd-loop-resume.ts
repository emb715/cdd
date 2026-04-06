import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

/**
 * CDD Loop Resume Plugin for OpenCode
 *
 * Replaces OpenCode's default compaction prompt with a CDD-aware one when a
 * loop is active. This allows /cdd:loop to survive context compaction without
 * losing state — the loop continues in the same session uninterrupted.
 *
 * Equivalent to the Stop hook in Claude Code, but instead of restarting after
 * context rotation, it injects checkpoint state into the compaction prompt so
 * the loop resumes automatically within the same session.
 *
 * Source: https://opencode.ai/docs/plugins/#compaction-hooks
 */
export const CddLoopPlugin: Plugin = async ({ directory }) => {
  return {
    "experimental.session.compacting": async (_input, output) => {
      const cddDir = path.join(directory, "_cdd");
      if (!fs.existsSync(cddDir)) return;

      // Find the most recently modified active loop checkpoint
      let checkpoint: string | null = null;
      let workId: string | null = null;
      let latestMtime = 0;

      for (const entry of fs.readdirSync(cddDir)) {
        // Skip meta directory
        if (entry === ".meta") continue;

        const cpPath = path.join(cddDir, entry, ".loop", "checkpoint.md");
        if (!fs.existsSync(cpPath)) continue;

        const mtime = fs.statSync(cpPath).mtimeMs;
        if (mtime > latestMtime) {
          latestMtime = mtime;
          checkpoint = fs.readFileSync(cpPath, "utf8");
          workId = entry;
        }
      }

      // No active loop — fall back to default compaction
      if (!checkpoint || !workId) return;

      // Read task status for full state restore
      const statusPath = path.join(cddDir, workId, ".loop", "loop-status.json");
      const loopStatus = fs.existsSync(statusPath)
        ? fs.readFileSync(statusPath, "utf8")
        : "{}";

      // Read last N lines of loop-log for recent context
      const logPath = path.join(cddDir, workId, ".loop", "loop-log.md");
      const recentLog = fs.existsSync(logPath)
        ? fs.readFileSync(logPath, "utf8").split("\n").slice(-30).join("\n")
        : "";

      output.prompt = `
You are resuming a CDD loop orchestration session after context compaction.
Do NOT ask questions. Do NOT re-introduce yourself. Continue executing immediately.

## Active Work Item
${workId}

## Loop Checkpoint
${checkpoint}

## Task Status (loop-status.json)
${loopStatus}

## Recent Loop Log (last 30 lines)
${recentLog}

## Resume Instructions

1. You are a CDD loop orchestrator. Your rules:
   - Never implement code directly — always spawn sub-agents via Task tool
   - Emit status after every event
   - Never ask user questions — auto-detect everything
   - All state persists to disk — loop survives context resets losslessly
   - Spawn parallel tasks in a SINGLE message (multiple Task calls = true parallelism)

2. Read _cdd/${workId}/CONTEXT.md to load task descriptions and done-when criteria for pending tasks.

3. Restore state from checkpoint:
   - current_group_index: resume from this group
   - completed_tasks: do NOT re-run these
   - pending_tasks: these still need execution

4. Reset event_counter = 0 (new context window after compaction).

5. Read _cdd/.meta/loop.config.yaml for config values (rotation_threshold, review_enabled, etc).

6. Resume the EXECUTE protocol from current_group_index. Follow all protocols exactly:
   parallel safety, health checks, review cycle, completion check.

Continue the loop now. Do not wait for user input.
`.trim();
    },
  };
};
