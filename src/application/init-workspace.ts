import { defaultConfig } from "../domain/config.js";
import { ToolkitError } from "../domain/types.js";
import type { InitInput, InitResult, TemplatePort, WorkspacePort } from "./ports.js";
import { ownershipNote, renderTemplate } from "./render.js";

const CORE_FILES = [
  { template: "kac.yaml", dest: "kac.yaml" },
  { template: "README.md", dest: "README.md" },
  { template: "AGENTS.md", dest: "AGENTS.md" },
  { template: "primer.md", dest: "primer.md" },
  { template: "index.md", dest: "index.md" },
  { template: "log.md", dest: "log.md" },
  { template: "concepts/getting-started.md", dest: "concepts/getting-started.md" },
  { template: "concepts/README.md", dest: "concepts/README.md" },
  { template: "retired/README.md", dest: "retired/README.md" },
  { template: "retired/_template.md", dest: "retired/_template.md" },
  { template: "skills/README.md", dest: "skills/README.md" },
];

const SKILL_FILES = [
  { template: "skills/knowledge-priming/SKILL.md", dest: "skills/knowledge-priming/SKILL.md" },
  { template: "skills/retirement-gate/SKILL.md", dest: "skills/retirement-gate/SKILL.md" },
  { template: "skills/stack-audit/SKILL.md", dest: "skills/stack-audit/SKILL.md" },
  { template: ".cursor/rules/kac-primer.mdc", dest: ".cursor/rules/kac-primer.mdc" },
];

export function initWorkspace(
  workspace: WorkspacePort,
  templates: TemplatePort,
  input: InitInput,
): InitResult {
  assertTarget(workspace, input.force);

  const vars = templateVars(input);
  const created: string[] = [];
  const files = input.withSkills ? [...CORE_FILES, ...SKILL_FILES] : CORE_FILES;

  for (const file of files) {
    const rendered = renderTemplate(templates.load(file.template), vars);
    workspace.write(file.dest, rendered);
    created.push(file.dest);
  }

  return { created };
}

function assertTarget(workspace: WorkspacePort, force: boolean): void {
  if (!workspace.exists(".")) {
    return;
  }
  if (!workspace.isDirectory(".")) {
    throw new ToolkitError("init", "Target path exists and is not a directory.");
  }
  const entries = workspace.list(".");
  if (entries.length > 0 && !force) {
    throw new ToolkitError(
      "init",
      "Directory is not empty. Choose an empty folder or pass --force to overwrite.",
    );
  }
}

function templateVars(input: InitInput): Record<string, string> {
  const config = defaultConfig(input);
  return {
    title: input.title,
    domain: input.domain,
    scale: input.scale,
    owner: input.owner || "(unassigned)",
    date: input.today,
    ownership_note: ownershipNote(input.scale),
    primer_max_lines: String(config.primer_max_lines),
  };
}
