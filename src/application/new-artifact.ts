import { ToolkitError } from "../domain/types.js";
import type { NewKind, TemplatePort, WorkspacePort } from "./ports.js";
import { parseConfig } from "../domain/config.js";
import { renderTemplate, titleFromSlug } from "./render.js";
import { parse as parseYaml } from "yaml";

export function newArtifact(
  workspace: WorkspacePort,
  templates: TemplatePort,
  kind: NewKind,
  slug: string,
  today: string,
): string {
  assertSlug(slug);
  if (!workspace.exists("kac.yaml")) {
    throw new ToolkitError("new", "No kac.yaml here. Run `kac init` first.");
  }
  const config = parseConfig(parseYaml(workspace.read("kac.yaml")), "kac.yaml");
  const dest = destination(kind, slug, config.paths);
  if (workspace.exists(dest)) {
    throw new ToolkitError("new", `${dest} already exists.`);
  }
  const vars = {
    title: titleFromSlug(slug),
    slug,
    date: today,
    domain: config.domain,
  };
  workspace.write(dest, renderTemplate(templates.load(templateName(kind)), vars));
  return dest;
}

function destination(
  kind: NewKind,
  slug: string,
  paths: { concepts: string; retired: string; skills: string },
): string {
  if (kind === "concept") {
    return `${paths.concepts}/${slug}.md`;
  }
  if (kind === "retirement") {
    return `${paths.retired}/${slug}.md`;
  }
  return `${paths.skills}/${slug}/SKILL.md`;
}

function templateName(kind: NewKind): string {
  if (kind === "concept") {
    return "fragments/concept.md";
  }
  if (kind === "retirement") {
    return "fragments/retirement.md";
  }
  return "fragments/skill.md";
}

function assertSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ToolkitError(
      "new",
      "Slug must be lowercase letters, numbers, and hyphens (example: ship-date-claim).",
    );
  }
}
