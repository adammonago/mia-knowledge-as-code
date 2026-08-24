# Concepts

One file per durable unit. That is the Substrate contract: a human can judge it, a machine can parse it, and it survives a tool change.

## Frontmatter minimum

```yaml
---
type: Claim
title: Human-readable name
id: stable-slug
status: draft
confidence: medium
evidence_tier: working-note
---
```

`type` and `title` are required. Add `confidence` or `evidence_tier` on anything you would cite.

## Status

- `draft` — not ready to travel
- `stable` — reviewed enough to use
- `retired` — move the file to `../retired/` with a Retirement Record

Create the next one with `kac new concept <slug>`.
