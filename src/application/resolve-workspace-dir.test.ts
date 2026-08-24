import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveWorkspaceDirectory } from "./resolve-workspace-dir.js";

test("validate uses the requested dir when it already has kac.yaml", () => {
  assert.equal(
    resolveWorkspaceDirectory({
      requested: "/src/app/memory",
      hasKacYaml: (dir) => dir === "/src/app/memory",
    }),
    "/src/app/memory",
  );
});

test("validate falls back to ./knowledge after init in a non-empty clone", () => {
  assert.equal(
    resolveWorkspaceDirectory({
      requested: "/src/app",
      hasKacYaml: (dir) => dir === "/src/app/knowledge",
    }),
    "/src/app/knowledge",
  );
});

test("validate does not invent a path when neither location has kac.yaml", () => {
  assert.equal(
    resolveWorkspaceDirectory({
      requested: "/src/app",
      hasKacYaml: () => false,
    }),
    "/src/app",
  );
});
