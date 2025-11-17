# 🚀 CDD v1.0 Onboarding

Welcome! This guide will help you install **Context-Driven Development (CDD)** in your project using an AI assistant.

## What is CDD?

CDD is a methodology that treats documentation as infrastructure. It helps you and AI assistants maintain perfect context across coding sessions through structured work items, implementation plans, and session logs.

## Quick Installation

**Step 1:** Copy the entire prompt below
**Step 2:** Paste it into your AI assistant (Claude Code, ChatGPT, Cursor, etc.)
**Step 3:** Answer the setup questions
**Step 4:** Start using CDD!

---

## 📋 COPY THIS PROMPT

```
I want to install Context-Driven Development (CDD) v1.0 in my project. Please help me set it up following these steps:

## Your Task

You are helping me install CDD v1.0 by EMB, a methodology for maintaining development context through structured documentation.

## Installation Steps

### Step 1: Understand My Environment

First, please detect:
1. What AI assistant am I using? (Check if you have access to slash commands, file system, etc.)
2. What is my current working directory?
3. Do I already have a `.claude/` folder or `cdd/` folder?

### Step 2: Ask Me Setup Questions

Before proceeding, please ask me these questions (one at a time for clarity):

**Project Information:**
- What is your project about? (Brief description)
- What programming language/framework are you using?
- Are you working solo or with a team?

**Author Information:**
- What is your name? (for file attribution)
- Email or handle (optional - e.g., @username)

**Existing Documentation:**
- Do you have any existing documentation I should preserve? (yes/no)
- If yes, where is it located?

**Installation Preference:**
- Should I try to clone the official CDD repo or create files from scratch?

### Step 3: Installation Method

Based on my answers, choose ONE of these approaches:

**Option A: Clone Official Repo (Preferred)**
If you can access GitHub:
1. Try to clone/download from: https://github.com/emb715/cdd
2. Copy only the necessary structure (not .git):
   - `.claude/commands/` → 5 command files
   - `cdd/.meta/templates/` → 4 template files
   - `cdd/.meta/QUICK_REFERENCE.md`

**Option B: Create from Scratch (Fallback)**
If cloning isn't possible, create this structure:

```text
   project-root/
   ├── .claude/
   │   └── commands/
   │       ├── create-work.md      # v1.0 - Create work items
   │       ├── plan-work.md        # v1.0 - Generate plans
   │       ├── save-session.md     # v1.0 - Track progress
   │       ├── complete-work.md    # v1.0 - Mark complete
   │       └── list-work.md        # v1.0 - Dashboard view
   │
   └── cdd/
      └── .meta/
         ├── QUICK_REFERENCE.md  # Command cheat sheet
         ├── templates/
         │   ├── DECISIONS_TEMPLATE.md
         │   ├── IMPLEMENTATION_PLAN_TEMPLATE.md
         │   ├── SESSION_NOTES_TEMPLATE.md
         │   └── IMPLEMENTATION_SUMMARY_TEMPLATE.md
         └── examples/
               └── README.md       # Example guide
```

**Important:** Do NOT modify or create .gitignore files. CDD files are meant to be committed to version control.

### Step 4: Customize Files

After creating the structure:
1. Update author attribution in all files with my name/handle
2. If I provided existing docs, suggest how to migrate them
3. Add project-specific patterns to templates if I shared them

### Step 5: Verification

After installation, please:
1. List all files created
2. Verify the structure is correct
3. If I'm using Claude Code, test one slash command (e.g., `/list-work`)
4. Show me the directory tree

### Step 6: Next Steps Guide

Finally, provide me with:
1. Quick start commands (create first work item)
2. Link to QUICK_REFERENCE.md for command help
3. Suggested first work item based on my project

## Important Notes

- **DO NOT** overwrite any existing project files
- **DO** preserve any existing `.claude/` configurations I have
- **DO** ask before making any destructive changes
- **DO** provide clear summaries of what you created
- **DO** customize templates with my project context if I shared it

## Expected Outcome

After this process, I should have:
✅ Complete CDD v1.0 file structure
✅ 5 working slash commands (if supported)
✅ 4 customized templates
✅ Quick reference guide
✅ Clear next steps

Ready to start? Please begin with Step 1: Understanding my environment.
```

---

## What Gets Installed

When you run this prompt, the AI will create:

### Slash Commands (`.claude/commands/`)
- **`/create-work`** - Create new work items (features, bugs, refactors, etc.)
- **`/plan-work`** - Generate implementation plans from requirements
- **`/save-session`** - Track progress after each coding session
- **`/complete-work`** - Mark work complete and generate summaries
- **`/list-work`** - Dashboard view with filtering

### Templates (`cdd/.meta/templates/`)
- **`DECISIONS_TEMPLATE.md`** - Requirements and technical decisions
- **`IMPLEMENTATION_PLAN_TEMPLATE.md`** - Phased task breakdown
- **`SESSION_NOTES_TEMPLATE.md`** - Running session log
- **`IMPLEMENTATION_SUMMARY_TEMPLATE.md`** - Post-completion retrospective

### Documentation
- **`QUICK_REFERENCE.md`** - Command cheat sheet and best practices
- **`README.md`** (examples) - How to use examples

## Requirements

**Minimum:**
- Any AI assistant with file creation capabilities
- Write access to your project directory

**Recommended:**
- **Claude Code** (for slash command support)
- **Git** initialized in your project
- 5-10 minutes for setup

**Optional:**
- GitHub access (for cloning official repo)
- Existing documentation to migrate

## After Installation

### Verify It Worked

1. **Check the folders exist:**
   ```bash
   ls .claude/commands/
   ls cdd/.meta/
   ```

2. **Test a command** (Claude Code only):
   ```
   /list-work
   ```
   You should see "No work items found" (expected for new installation)

3. **Read the quick reference:**
   ```bash
   cat cdd/.meta/QUICK_REFERENCE.md
   ```

### Create Your First Work Item

Try this to get started:
```
/create-work [brief description of something you're building]
```

For example:
```
/create-work user authentication system
```

The AI will ask you questions and create a complete work item folder with:
- `cdd/0001-user-authentication-system/DECISIONS.md`
- `cdd/0001-user-authentication-system/IMPLEMENTATION_PLAN.md`
- `cdd/0001-user-authentication-system/SESSION_NOTES.md`

## Troubleshooting

### "AI says it can't access files"
**Solution:** Your AI may not have file system access. Ask it to:
1. Provide the file contents as text
2. You copy-paste into files manually
3. Or use an AI with file access (Claude Code, Cursor)

### "Slash commands don't work"
**Solution:** Slash commands only work in Claude Code. For other AIs:
- Use the regular prompt: "Create a work item for [description]"
- Reference the command files in `.claude/commands/` for guidance

### "Files already exist"
**Solution:** The AI detected existing CDD files. Options:
1. Keep existing and skip installation
2. Backup existing (`cdd_backup/`) and reinstall
3. Merge configurations (ask AI for help)

### "Wrong author attribution"
**Solution:** The AI used default values. To fix:
1. Re-run the prompt with correct author info
2. Or manually find/replace in files:
   - Search for: `Author:` or `by EMB`
   - Replace with your name

### "Templates don't fit my project"
**Solution:** Templates are starting points! Customize them:
1. Edit files in `cdd/.meta/templates/`
2. Add/remove sections as needed
3. Templates are copied when creating new work, not referenced

## Customization Guide

### Adapt Templates to Your Stack

**For React Projects:**
- Add component patterns to `DECISIONS_TEMPLATE.md`
- Include hook examples in `IMPLEMENTATION_PLAN_TEMPLATE.md`

**For Backend/API Projects:**
- Add endpoint documentation sections
- Include database schema templates

**For Mobile Apps:**
- Add platform-specific sections (iOS/Android)
- Include app store deployment checklists

### Modify Commands

Commands are in `.claude/commands/` - you can edit them to:
- Change question templates
- Adjust folder structures
- Add custom validation rules
- Include project-specific prompts

### Add Custom Work Types

Edit `create-work.md` to add beyond the default 5 types:
- `docs` - Documentation work
- `chore` - Maintenance tasks
- `security` - Security fixes
- Whatever fits your workflow!

## Next Steps

1. **Read the Quick Reference:**
   ```bash
   cat cdd/.meta/QUICK_REFERENCE.md
   ```

2. **Create your first work item:**
   ```
   /create-work [your current task]
   ```

3. **Generate an implementation plan:**
   ```
   /plan-work 0001
   ```

4. **Start coding!** Then save your session:
   ```
   /save-session 0001
   ```

5. **Explore examples** (if installed):
   ```bash
   cat cdd/.meta/examples/README.md
   ```

## Additional Resources

- **Full README:** See `README.md` in repository root
- **Changelog:** See `CHANGELOG.md` for version history
- **License:** MIT - see `LICENSE` file
- **Author:** EMB (Ezequiel M. Benitez) @emb715

## Getting Help

**Issues with installation?**
- Check troubleshooting section above
- Review `cdd/.meta/QUICK_REFERENCE.md`
- Open an issue on GitHub

**Want to customize?**
- All files are editable markdown
- Templates are in `cdd/.meta/templates/`
- Commands are in `.claude/commands/`

**Questions about methodology?**
- Read the main `README.md`
- Check examples in `cdd/.meta/examples/`
- See philosophy section in docs

---

## What Makes CDD Different?

**Traditional Approach:**
```
You: "What was I working on?"
*searches through chat history*
*tries to remember context*
*starts over from scratch*
```

**With CDD:**
```
You: "/list-work --status=in-progress"
AI: Shows your active work with full context
You: Opens DECISIONS.md, knows exactly where you were
AI: Continues from your last SESSION_NOTES.md entry
```

**The Result:** No more context loss. Ever.

---

## Quick Wins You'll See Immediately

✅ **Never forget what you were building**
- DECISIONS.md preserves requirements

✅ **Pick up instantly after breaks**
- SESSION_NOTES.md tracks your progress

✅ **AI understands your project**
- Structured context = better AI help

✅ **Onboard teammates faster**
- Self-contained work items tell the story

✅ **Make better decisions**
- Document the "why" not just the "what"

---

**Ready?** Copy the prompt above and paste it into your AI assistant!

**Questions?** Open an issue or reach out to @emb715

**CDD v1.0** - Never lose context again.
