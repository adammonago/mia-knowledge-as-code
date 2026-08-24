import type { Issue } from "./types.js";

const REQUIRED = ["type", "title"] as const;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

export function conceptIssues(
  path: string,
  frontmatter: Record<string, unknown> | null,
): Issue[] {
  if (!frontmatter) {
    return [
      {
        path,
        severity: "error",
        message: "Concept is missing YAML frontmatter. Portable units need type and title at minimum.",
      },
    ];
  }

  const issues: Issue[] = [];
  for (const field of REQUIRED) {
    if (isBlank(frontmatter[field])) {
      issues.push({
        path,
        severity: "error",
        message: `Concept is missing required frontmatter field "${field}".`,
      });
    }
  }
  return issues;
}

export function duplicateIdIssues(
  files: Array<{ path: string; id: string }>,
): Issue[] {
  const byId = new Map<string, string[]>();
  for (const file of files) {
    const paths = byId.get(file.id) ?? [];
    paths.push(file.path);
    byId.set(file.id, paths);
  }

  const issues: Issue[] = [];
  for (const [id, paths] of byId) {
    if (paths.length < 2) {
      continue;
    }
    for (const path of paths) {
      issues.push({
        path,
        severity: "error",
        message: `Duplicate concept id "${id}" also used in ${paths.filter((p) => p !== path).join(", ")}.`,
      });
    }
  }
  return issues;
}
