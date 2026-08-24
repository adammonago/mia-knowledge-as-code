# {{title}}

This is a Knowledge as Code workspace. Durable memory lives in files: reviewable, versioned, and readable by humans and agents.

**What this workspace is for:** {{domain}}

## The Knowledge Stack

| Layer | What lives here |
| --- | --- |
| Substrate | Portable markdown + YAML frontmatter (`concepts/`, this README) |
| Semantics | IDs, evidence, retirement records, skills as intent on disk |
| System | `primer.md`, validation, audit, named owner, agent rules |

Tools are surfaces. These files are the contract.

## Start here

1. Edit `primer.md` (keep it thin — under {{primer_max_lines}} essential lines).
2. Replace `concepts/getting-started.md` with one file worth keeping: a claim, a decision, or a reject list.
3. Point your agent at `AGENTS.md`.
4. From the toolkit checkout, run `npm run kac -- validate [dir]` and `npm run kac -- audit [dir]` (pass this folder if you are not already in it). `kac` is not on PATH until the toolkit is linked or published.

```bash
npm run kac -- new concept my-claim --dir [dir]
npm run kac -- new retirement old-claim --dir [dir]
npm run kac -- new skill review-gate --dir [dir]
```

## Retirement

Do not delete knowledge that turned out to be wrong. Move it to `retired/` with three fields: what you stopped asserting, why, and what would falsify the retirement.

## Cadence

- Weekly: enrich one concept; retire stale claims in the open.
- Quarterly: run `npm run kac -- audit [dir]` from the toolkit checkout and answer the questions it cannot probe from files.

Initialized {{date}} · scale: {{scale}} · owner: {{owner}}
