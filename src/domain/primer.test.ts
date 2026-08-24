import assert from "node:assert/strict";
import { test } from "node:test";
import { countEssentialLines, primerIssues } from "./primer.js";

test("empty lines and comments do not count against the attention budget", () => {
  const text = "# Title\n\n<!-- note -->\n\nKeep this thin.\n";
  assert.equal(countEssentialLines(text), 2);
});

test("over-budget primers fail closed", () => {
  const text = Array.from({ length: 12 }, (_, i) => `line ${i}`).join("\n");
  const issues = primerIssues("primer.md", text, 10);
  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.severity, "error");
});
