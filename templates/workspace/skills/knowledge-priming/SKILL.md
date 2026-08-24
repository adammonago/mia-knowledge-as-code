---
name: knowledge-priming
description: Load the workspace primer before answering from this corpus. Use when starting work, answering from concepts, or when the user asks what this workspace is.
---

# Knowledge priming

1. Read `primer.md` at the workspace root.
2. Stop. Treat it as ambient context for the rest of the session.
3. Do not load the entire `concepts/` directory.
4. Load one additional file only when the task requires it.

If `primer.md` is missing, tell the user to run `kac init` or restore the primer. Continue with a warning; do not invent house style.
