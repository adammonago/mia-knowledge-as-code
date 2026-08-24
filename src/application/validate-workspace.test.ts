import assert from "node:assert/strict";
import { test } from "node:test";
import { validateWorkspace } from "./validate-workspace.js";
import { initWorkspace } from "./init-workspace.js";
import { newArtifact } from "./new-artifact.js";
import { FileTemplates, packageTemplateRoot } from "../infrastructure/file-templates.js";
import { MemoryWorkspace } from "../infrastructure/memory-workspace.js";

test("retirement files without the three fields fail validate", () => {
  const workspace = new MemoryWorkspace();
  const templates = new FileTemplates(packageTemplateRoot());
  initWorkspace(workspace, templates, {
    title: "Archive",
    domain: "Family research.",
    scale: "solo",
    owner: "Ada",
    withSkills: false,
    force: false,
    today: "2026-08-18",
  });
  newArtifact(workspace, templates, "retirement", "wrong-hyman", "2026-08-18");
  const issues = validateWorkspace(workspace);
  assert.ok(issues.some((issue) => issue.path === "retired/wrong-hyman.md"));
  assert.ok(issues.some((issue) => issue.message.includes("stopped_asserting")));
});

test("new concept files are created with a stable id", () => {
  const workspace = new MemoryWorkspace();
  const templates = new FileTemplates(packageTemplateRoot());
  initWorkspace(workspace, templates, {
    title: "Archive",
    domain: "Family research.",
    scale: "solo",
    owner: "Ada",
    withSkills: false,
    force: false,
    today: "2026-08-18",
  });
  const dest = newArtifact(workspace, templates, "concept", "1913-manifest", "2026-08-18");
  assert.equal(dest, "concepts/1913-manifest.md");
  assert.match(workspace.read(dest), /id: 1913-manifest/);
  assert.deepEqual(validateWorkspace(workspace), []);
});
