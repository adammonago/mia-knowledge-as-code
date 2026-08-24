---
name: retirement-gate
description: Enforce annotated withdrawal. Use when deleting, retiring, correcting, or superseding a claim.
---

# Retirement gate

Do not delete a knowledge file to "clean up."

When a claim is no longer current:

1. Set `status: retired` (OKF consumers may treat `deprecated` as the same lifecycle).
2. Fill `stopped_asserting`, `why`, and `falsifiers`.
3. Move the file into `retired/`.
4. Add `redirects_to` if a replacement concept exists.
5. Leave the file readable so lineage questions can be answered.

Primary answers must not treat retired files as current claims. If the user asks why an old deck still says X, read the retirement record.
