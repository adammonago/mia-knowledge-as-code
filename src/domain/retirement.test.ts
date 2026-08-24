import assert from "node:assert/strict";
import { test } from "node:test";
import { isRetiredStatus, retirementIssues } from "./retirement.js";

test("active claims do not require a Retirement Record", () => {
  assert.deepEqual(
    retirementIssues("concepts/a.md", { status: "stable", title: "A" }),
    [],
  );
});

test("retired claims require the three annotation fields", () => {
  const issues = retirementIssues("retired/a.md", { status: "retired" });
  assert.equal(issues.length, 3);
  assert.ok(issues.every((issue) => issue.severity === "error"));
});

test("deprecated is treated as retired for this toolkit", () => {
  assert.equal(isRetiredStatus("deprecated"), true);
  const issues = retirementIssues("retired/a.md", {
    status: "deprecated",
    stopped_asserting: "We process 10k pages/day",
    why: "Provenance gap",
    falsifiers: "Reconstructed source ledger",
  });
  assert.equal(issues.length, 0);
});
