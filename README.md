# Knowledge as Code

An open toolkit for standing up a **Knowledge as Code** workspace in one command.

Durable knowledge is a file with structure humans and machines can share. Tools are surfaces. Practices are the product.

This toolkit implements [The Knowledge Stack](https://www.adammonago.com/knowledge-as-code/):

| Layer | What you get |
| --- | --- |
| **Substrate** | Portable markdown + YAML frontmatter (OKF-shaped bundle) |
| **Semantics** | Stable IDs, evidence fields, Retirement Records, skills as intent on disk |
| **System** | Thin primer, agent contract, `kac validate`, `kac audit` |

It is not a wiki, a RAG chatbot, or a prompt pack.

## Start a workspace

```bash
npx knowledge-as-code init
```

Or from a clone of this repo:

```bash
npm install
npm run build
node dist/cli.js init --yes --name "Proof registry" --domain "Defensible claims for proposals."
```

If the current folder already has files, init creates `./knowledge` so it will not clutter an existing project. Pass a path to choose the location:

```bash
kac init ./memory --yes --scale team --owner "Ada"
```

You get:

- `primer.md` — always-on attention budget (keep it thin)
- `concepts/getting-started.md` — one file worth keeping
- `retired/` — annotated withdrawal, not deletion
- `skills/` — Durable Intent agents can invoke
- `AGENTS.md` plus a Cursor rule that loads the primer
- `kac.yaml` — workspace contract

Then:

```bash
kac validate
kac audit
kac new concept ship-date-claim
```

Point your agent at `AGENTS.md`. Do not dump the vault into context.

## Commands

| Command | Job |
| --- | --- |
| `kac init [dir]` | Create the workspace |
| `kac new concept\|retirement\|skill <slug>` | Add the next durable unit |
| `kac validate [dir]` | Lint frontmatter, unique IDs, primer budget, Retirement Record fields |
| `kac audit [dir]` | Probe Substrate / Semantics / System |

Init flags: `--name`, `--domain`, `--scale solo|team`, `--owner`, `--yes`, `--force`, `--no-skills`.

## What “done” looks like

A workspace is ready when:

1. A new person or a new agent session can start from `primer.md` without a hallway conversation.
2. Each claim is one file, with a type, a title, and a source.
3. Wrong knowledge stays in `retired/` with what you stopped asserting, why, and what would falsify the retirement.
4. `kac validate` is clean and `kac audit` names remaining gaps instead of recommending a new platform.

## Schemas

Machine-readable contracts live in [`schemas/`](./schemas/):

- `concept.schema.json` — portable unit frontmatter
- `retirement-record.schema.json` — the three required retirement fields
- `kac-config.schema.json` — `kac.yaml`

## Design sources

The practices come from the Knowledge as Code essay series:

- [Knowledge as Code](https://www.adammonago.com/knowledge-as-code/)
- [Negative Knowledge](https://www.adammonago.com/negative-knowledge/)
- [Knowledge Priming](https://www.adammonago.com/knowledge-priming/)
- [Reliable AI Begins Before the Model](https://www.adammonago.com/reliable-ai-begins-before-the-model/)
- [The Builder Journey](https://www.adammonago.com/the-builder-journey/)
- [The COBOL Problem](https://www.adammonago.com/the-cobol-problem/)

Companion substrate: [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).

## License

MIT
