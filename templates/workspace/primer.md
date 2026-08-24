# Primer — {{title}}

Always-on context for humans and agents. Keep this file under {{primer_max_lines}} essential lines. Long procedures belong in `skills/`.

## What this workspace is for

{{domain}}

## Scale and ownership

Scale: {{scale}}
Owner: {{owner}}

{{ownership_note}}

## Trusted sources

Start here. Do not invent a parallel map.

| Need | Path |
| --- | --- |
| Orientation | `primer.md` (this file) |
| Durable units | `concepts/` |
| Wrong knowledge | `retired/` |
| Behavior on disk | `skills/` |
| Bundle listing | `index.md` |

## Do

- Load this primer before answering from the corpus.
- Keep one concept per file, with `type` and `title` in frontmatter.
- Log failed searches and rejected hits; they are load-bearing.
- Put origin and review `status` on a claim before it travels.

## Do not

- Dump the vault into the context window.
- Invent claims, metrics, or provenance that are not in the files.
- Delete a retired claim. Annotate it.
- Silently overwrite canonical files.
- Grow this primer past the line budget.

## When to load more

| Task | Load next |
| --- | --- |
| Answer from the corpus | One relevant file in `concepts/` |
| Why a claim changed | Matching file in `retired/` |
| Repeatable behavior | `skills/<name>/SKILL.md` |
| Health of the stack | `kac audit` |

Initialized {{date}}.
