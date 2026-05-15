#!/usr/bin/env bash
# CDD Loop Resume Hook
# Fires on session Stop. If a .resume file exists, outputs the resume command.
# Claude Code treats Stop hook stdout as the next user input turn.

set -euo pipefail

# Find the most recently modified .resume file across all _cdd work items
RESUME_FILE=$(find _cdd -name ".resume" -path "*/.loop/.resume" 2>/dev/null \
  | xargs ls -t 2>/dev/null \
  | head -1)

if [[ -z "$RESUME_FILE" ]]; then
  exit 0  # No active loop — nothing to resume
fi

COMMAND=$(cat "$RESUME_FILE")
if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# Delete before output — prevents re-trigger if next session also rotates
rm "$RESUME_FILE"

# Output is injected as the next user turn by Claude Code
echo "$COMMAND"
