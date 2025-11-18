# Changelog

All notable changes to CDD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-11-18

### Fixed
- Fixed `npx @emb715/cdd add rag` failing when user's project has no package.json
  - Now uses `npm pack` to download package to temp directory instead of `npm install`
  - Works in any directory without requiring package.json
- Removed references to unreleased CLI tool from README

## [0.1.0] - 2025-11-18

### Added
- Initial public release
- `@emb715/cdd` - Base CDD methodology package
- `@emb715/cdd-rag` - RAG extension for semantic search
- CLI tool for easy installation (`npx @emb715/cdd init`)
- Five slash commands for Claude Code:
  - `/cdd:create-work` - Create new work items
  - `/cdd:plan-work` - Generate implementation plans
  - `/cdd:save-session` - Track session progress
  - `/cdd:complete-work` - Mark work complete with evidence
  - `/cdd:list-work` - View all work items
- Three template modes: solo-dev (default), minimal, comprehensive
- Comprehensive documentation (250+ markdown files)
- Metrics system for tracking productivity
- Python-based RAG system with automated setup

### Features
- Context persistence across sessions
- AI-assisted planning and documentation
- Automatic task completion detection
- Evidence-based work validation
- Semantic search over CDD workspace

### Documentation
- Complete README with examples and workflows
- Package-specific READMEs
- Methodology documentation in cdd/.meta/
- RAG setup guide with troubleshooting

---

[0.1.1]: https://github.com/emb715/cdd/releases/tag/v0.1.1
[0.1.0]: https://github.com/emb715/cdd/releases/tag/v0.1.0
