---
name: stack-audit
description: Audit a Knowledge as Code workspace against The Knowledge Stack. Use when the user asks if the workspace is healthy, complete, or ready for agents.
---

# Stack audit

Run `kac audit` and read the findings.

Then ask the questions the CLI cannot see in files:

## Substrate

- Can a human read every durable unit without a vendor UI?
- Would these files still make sense after a tool change?

## Semantics

- Is doubt on the surface (reject lists, merge cautions), or buried?
- Are IDs shared, or is meaning living in folder names?

## System

- Who owns the primer, and when was it last reviewed?
- Would a new person or a new agent session succeed without calling the author?

Name missing practices. Do not recommend a new platform.
