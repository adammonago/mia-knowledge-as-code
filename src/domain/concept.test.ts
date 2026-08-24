import assert from "node:assert/strict";
import { test } from "node:test";
import { conceptIssues, duplicateIdIssues } from "./concept.js";

test("concepts require type and title", () => {
  const issues = conceptIssues("concepts/a.md", { type: "Claim" });
  assert.equal(issues.length, 1);
  assert.match(issues[0]?.message ?? "", /title/);
});

test("duplicate ids are reported on every colliding file", () => {
  const issues = duplicateIdIssues([
    { path: "concepts/a.md", id: "ship" },
    { path: "concepts/b.md", id: "ship" },
  ]);
  assert.equal(issues.length, 2);
});
