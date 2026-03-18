---
name: cdd-workflow
description: Use this skill whenever the user is working in a project that has CDD installed (_cdd/ directory exists) AND describes a task, bug, feature, or refactor they want to work on. Also trigger when the user says "where was I", "what's next", "let's continue", "pick up where I left off", or asks about current work. Trigger when /cdd:loop is mentioned or when a CONTEXT.md work item is in context. Trigger when the user asks what CDD commands are available. Do NOT trigger for general questions about the CDD package itself or when working inside the CDD repo.
version: 1.0.0
---

# CDD Workflow Awareness

This project uses CDD (Context-Driven Development). Commands are installed at `.claude/commands/cdd:*.md`.

## When to surface CDD

- User describes a new task, bug, or feature → suggest `/cdd:start [description]`
- User has a large workload or greenfield project → suggest `/cdd:scope [brief]` first
- User says "let's continue" or "what's next" → read `_cdd/*/STATUS.md`, report current state
- User is mid-work without a work item → suggest `/cdd:start` to capture it
- User finishes a chunk of work → suggest `/cdd:log`
- User seems done → suggest `/cdd:done`
- User asks what commands are available → list the quick reference below

## Command Quick Reference

| Command | What it does |
|---------|-------------|
| `/cdd:start [description]` | Create work item: CONTEXT.md + SESSIONS.md + STATUS.md |
| `/cdd:scope [brief]` | Scope large workload into work items (SCOPE_PLAN.md) |
| `/cdd:loop [work-id]` | Full-cycle orchestration: agents, review, auto-log |
| `/cdd:log` | Save session progress to active work item |
| `/cdd:decide "[question]"` | 4 parallel agents research options, human decides |
| `/cdd:done` | Mark active work item complete |

## Finding Current State

Active work items live in `_cdd/[XXXX-name]/`. To find where a user left off:

1. Read `_cdd/[work-id]/STATUS.md` first — 15-line YAML, fast to parse
2. Read `_cdd/[work-id]/CONTEXT.md` only if more detail is needed

`STATUS.md` fields: `phase`, `progress`, `active_task`, `next_task`, `blockers`, `last_updated`.

## Philosophy

Humans decide, AI assists. Do not start work autonomously without a work item. Do not create work items without user intent. Surface CDD when relevant, then get out of the way.
