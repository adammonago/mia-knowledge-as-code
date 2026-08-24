import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveInitDirectory } from "./resolve-init-dir.js";

test("init uses the current folder when it is empty", () => {
  assert.equal(
    resolveInitDirectory({ explicit: undefined, cwd: "/tmp/empty", cwdEmpty: true }),
    "/tmp/empty",
  );
});

test("init creates ./knowledge inside an existing project", () => {
  assert.equal(
    resolveInitDirectory({ explicit: undefined, cwd: "/src/app", cwdEmpty: false }),
    "/src/app/knowledge",
  );
});

test("an explicit path always wins", () => {
  assert.equal(
    resolveInitDirectory({ explicit: "./memory", cwd: "/src/app", cwdEmpty: false }),
    "./memory",
  );
});
