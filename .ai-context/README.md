# AI Context Documentation

This folder contains documentation specifically designed to help AI assistants quickly understand and work with this codebase.

## Purpose
- Provide quick reference for project structure, patterns, and conventions
- Reduce time needed to understand the codebase in new sessions
- Track implementation decisions and their rationale
- Document common tasks and how to perform them

## Files

- **`project-overview.md`** - High-level project description, tech stack, and architecture
- **`file-structure.md`** - Directory layout and key files with descriptions
- **`data-models.md`** - TypeScript interfaces, types, and data structures
- **`api-endpoints.md`** - All API routes and their purposes
- **`ui-patterns.md`** - UI components, styling conventions, and design system
- **`implementation-notes.md`** - Important decisions, gotchas, and patterns used
- **`changelog.md`** - Chronological list of changes made to the project

## How to Use

1. **Starting a new session?** Read `project-overview.md` first
2. **Need to modify APIs?** Check `api-endpoints.md` and `data-models.md`
3. **Working on UI?** Review `ui-patterns.md` for styling conventions
4. **Making changes?** Update relevant files and add entry to `changelog.md`

## Update Policy

**IMPORTANT**: When making code changes, always update the relevant context files:
- Modified types? → Update `data-models.md`
- Added API endpoint? → Update `api-endpoints.md`
- Changed UI patterns? → Update `ui-patterns.md`
- Any change? → Add entry to `changelog.md`

Keep these files in sync with the code!
