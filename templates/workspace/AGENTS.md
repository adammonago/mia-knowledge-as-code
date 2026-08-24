# Agent contract

This repository is a Knowledge as Code workspace.

Before answering from this corpus:

1. Read `primer.md`. That file is the attention budget. Do not dump `concepts/` into context.
2. Treat files in `retired/` as lineage. They must not appear as current claims unless the user asks why something changed.
3. Prefer citing a concept file over paraphrasing from training data.
4. If a claim is missing, say so. Do not invent provenance, metrics, or review status.
5. Do not overwrite canonical files unless the user asked, and never silently. Prefer a preview of the proposed change.
6. If you would paste the same instruction into a third session, add a skill under `skills/` instead.

Load more only when the task requires it: one concept, one skill, or `retired/` for a lineage question.

Workspace purpose: {{domain}}
