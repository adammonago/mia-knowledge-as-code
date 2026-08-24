import type { Issue } from "./types.js";

const RETIRED_STATUSES = new Set(["retired", "deprecated"]);

const REQUIRED_FIELDS = [
  "stopped_asserting",
  "why",
  "falsifiers",
] as const;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

export function isRetiredStatus(status: unknown): boolean {
  return typeof status === "string" && RETIRED_STATUSES.has(status);
}

export function retirementIssues(
  path: string,
  frontmatter: Record<string, unknown>,
): Issue[] {
  if (!isRetiredStatus(frontmatter.status)) {
    return [];
  }

  const issues: Issue[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (isBlank(frontmatter[field])) {
      issues.push({
        path,
        severity: "error",
        message: `Retirement Record is missing "${field}". Deletion without annotation is the failure; keep what you stopped asserting, why, and what would falsify the retirement.`,
      });
    }
  }
  return issues;
}
