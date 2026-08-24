import assert from "node:assert/strict";
import { test } from "node:test";
import { initWorkspace } from "./init-workspace.js";
import { validateWorkspace } from "./validate-workspace.js";
import { FileTemplates, packageTemplateRoot } from "../infrastructure/file-templates.js";
import { MemoryWorkspace } from "../infrastructure/memory-workspace.js";

function seededWorkspace() {
  const workspace = new MemoryWorkspace();
  const templates = new FileTemplates(packageTemplateRoot());
  initWorkspace(workspace, templates, {
    title: "Proof registry",
    domain: "Defensible proof points for proposals.",
    scale: "team",
    owner: "Ada",
    withSkills: true,
    force: false,
    today: "2026-08-18",
  });
  return workspace;
}

test("init writes a usable workspace without prompting", () => {
  const workspace = seededWorkspace();
  assert.equal(workspace.exists("kac.yaml"), true);
  assert.equal(workspace.exists("primer.md"), true);
  assert.equal(workspace.exists("concepts/getting-started.md"), true);
  assert.equal(workspace.exists("skills/knowledge-priming/SKILL.md"), true);
  assert.equal(workspace.exists(".cursor/rules/kac-primer.mdc"), true);
  assert.match(workspace.read("primer.md"), /Defensible proof points/);
  assert.match(workspace.read("kac.yaml"), /owner: "Ada"/);
});

test("init refuses a non-empty directory unless forced", () => {
  const workspace = new MemoryWorkspace();
  workspace.write("README.md", "already here");
  const templates = new FileTemplates(packageTemplateRoot());
  assert.throws(
    () =>
      initWorkspace(workspace, templates, {
        title: "X",
        domain: "Y",
        scale: "solo",
        owner: "",
        withSkills: false,
        force: false,
        today: "2026-08-18",
      }),
    /not empty/,
  );
});

test("a freshly initialized workspace validates", () => {
  const issues = validateWorkspace(seededWorkspace());
  assert.deepEqual(issues, []);
});
