import assert from "node:assert/strict";
import { test } from "node:test";
import { parseArgs } from "./parse-args.js";

test("init keeps the directory positional when boolean flags are present", () => {
  const parsed = parseArgs(["init", "--yes", "--force", "./memory"]);
  assert.equal(parsed.command, "init");
  if (parsed.command === "init") {
    assert.equal(parsed.dir, "./memory");
    assert.equal(parsed.yes, true);
    assert.equal(parsed.force, true);
  }
});

test("init --name does not steal the directory", () => {
  const parsed = parseArgs(["init", "--name", "Proof registry", "--domain", "Claims", "knowledge"]);
  assert.equal(parsed.command, "init");
  if (parsed.command === "init") {
    assert.equal(parsed.dir, "knowledge");
    assert.equal(parsed.title, "Proof registry");
    assert.equal(parsed.domain, "Claims");
  }
});

test("new requires kind and slug", () => {
  assert.throws(() => parseArgs(["new", "concept"]), /Usage: kac new/);
});
