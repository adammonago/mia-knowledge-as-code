import { parseConfig } from "../domain/config.js";
import { conceptIssues, duplicateIdIssues } from "../domain/concept.js";
import { primerIssues } from "../domain/primer.js";
import { isRetiredStatus, retirementIssues } from "../domain/retirement.js";
import { ToolkitError, type Issue } from "../domain/types.js";
import type { WorkspacePort } from "./ports.js";
import { parseFrontmatter } from "../domain/frontmatter.js";
import { parse as parseYaml } from "yaml";

export function validateWorkspace(workspace: WorkspacePort): Issue[] {
  if (!workspace.exists("kac.yaml")) {
    throw new ToolkitError(
      "validate",
      "No kac.yaml here. Run this in a workspace created by `kac init`, or pass the workspace path (after a clone, that is usually ./knowledge).",
    );
  }

  const config = parseConfig(parseYaml(workspace.read("kac.yaml")), "kac.yaml");
  const issues: Issue[] = [];

  if (!workspace.exists(config.primer)) {
    issues.push({
      path: config.primer,
      severity: "error",
      message: "Primer file is missing. The attention budget has to live on disk.",
    });
  } else {
    issues.push(
      ...primerIssues(
        config.primer,
        workspace.read(config.primer),
        config.primer_max_lines,
      ),
    );
  }

  const conceptFiles = markdownFiles(workspace, config.paths.concepts);
  const idEntries: Array<{ path: string; id: string }> = [];

  for (const path of conceptFiles) {
    const parsed = parseFrontmatter(workspace.read(path));
    issues.push(...conceptIssues(path, parsed.data));
    if (parsed.data && isRetiredStatus(parsed.data.status)) {
      issues.push(...retirementIssues(path, parsed.data));
    }
    const id = readId(path, parsed.data);
    if (id) {
      idEntries.push({ path, id });
    }
  }

  const retiredFiles = markdownFiles(workspace, config.paths.retired).filter(
    (path) => !path.endsWith("/_template.md") && !path.endsWith("/README.md"),
  );
  for (const path of retiredFiles) {
    const parsed = parseFrontmatter(workspace.read(path));
    if (!parsed.data) {
      issues.push({
        path,
        severity: "error",
        message: "Retired file is missing YAML frontmatter.",
      });
      continue;
    }
    if (!isRetiredStatus(parsed.data.status)) {
      issues.push({
        path,
        severity: "error",
        message: `Files in ${config.paths.retired}/ must set status: retired (or deprecated).`,
      });
    }
    issues.push(...retirementIssues(path, parsed.data));
    const id = readId(path, parsed.data);
    if (id) {
      idEntries.push({ path, id });
    }
  }

  issues.push(...duplicateIdIssues(idEntries));
  return issues;
}

function markdownFiles(workspace: WorkspacePort, dir: string): string[] {
  if (!workspace.exists(dir)) {
    return [];
  }
  return workspace
    .walkFiles(dir)
    .filter((path) => path.endsWith(".md") && !path.endsWith("/README.md"));
}

function readId(
  path: string,
  data: Record<string, unknown> | null,
): string | undefined {
  if (data && typeof data.id === "string" && data.id.trim()) {
    return data.id.trim();
  }
  const base = path.split("/").pop() ?? path;
  if (base.startsWith("_")) {
    return undefined;
  }
  return base.replace(/\.md$/, "");
}
