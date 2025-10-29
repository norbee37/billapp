# 🤖 AI Context System

This project includes comprehensive documentation specifically designed for AI assistants (and human developers) in the **`.ai-context/`** folder.

## Why This Exists

When AI assistants start a new session, they need to quickly understand:
- What this project does
- How it's structured  
- What patterns to follow
- Where to find things

Instead of reading the entire codebase each time, AI can quickly scan these focused reference files.

## Quick Navigation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [**AI_ASSISTANT_README.md**](./AI_ASSISTANT_README.md) | **START HERE** - Quick guide | Beginning of every session |
| [project-overview.md](.ai-context/project-overview.md) | Tech stack, features, architecture | Understanding what the app does |
| [file-structure.md](.ai-context/file-structure.md) | Where files are, what they do | Finding specific code |
| [data-models.md](.ai-context/data-models.md) | TypeScript interfaces, data flow | Working with data structures |
| [api-endpoints.md](.ai-context/api-endpoints.md) | All API routes with examples | Adding/modifying APIs |
| [ui-patterns.md](.ai-context/ui-patterns.md) | Component patterns, styling | UI/UX changes |
| [implementation-notes.md](.ai-context/implementation-notes.md) | Important decisions, gotchas | Understanding why things work this way |
| [changelog.md](.ai-context/changelog.md) | Change history | Seeing recent updates |
| [architecture-diagram.md](.ai-context/architecture-diagram.md) | Visual system overview | Understanding data flow |

## For AI Assistants

**First time on this project?**
1. Read `AI_ASSISTANT_README.md` (2 min)
2. Scan `project-overview.md` (3 min)
3. Reference other docs as needed

**Returning to this project?**
1. Check `changelog.md` for recent changes
2. Review files relevant to your current task

## Update Policy

⚠️ **CRITICAL**: When making code changes, update the relevant context files!

```
Changed types? → Update .ai-context/data-models.md
Modified API? → Update .ai-context/api-endpoints.md  
New UI pattern? → Update .ai-context/ui-patterns.md
Important decision? → Update .ai-context/implementation-notes.md
ANY change? → Add entry to .ai-context/changelog.md
```

## Benefits

✅ Faster onboarding for AI assistants  
✅ Consistent understanding across sessions  
✅ Reduced context gathering time  
✅ Living documentation that stays current  
✅ Useful for human developers too  

## Maintenance

These docs should be maintained alongside the code. Think of them as essential documentation, not optional notes.

When the codebase changes significantly, the `.ai-context/` folder should be updated to reflect those changes.

---

**Created**: 2025-10-29  
**Purpose**: Help AI assistants work more effectively with this codebase
