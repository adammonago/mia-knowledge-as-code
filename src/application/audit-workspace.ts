import { parseConfig } from "../domain/config.js";
import { STACK_AUDIT, type AuditCheck } from "../domain/stack-audit.js";
import { ToolkitError } from "../domain/types.js";
import { parseFrontmatter } from "../domain/frontmatter.js";
import { countEssentialLines } from "../domain/primer.js";
import { validateWorkspace } from "./validate-workspace.js";
import type { WorkspacePort } from "./ports.js";
import { parse as parseYaml } from "yaml";

export type AuditFinding = {
  check: AuditCheck;
  passed: boolean;
  detail: string;
};

export function auditWorkspace(workspace: WorkspacePort): AuditFinding[] {
  if (!workspace.exists("kac.yaml")) {
    throw new ToolkitError(
      "audit",
      "No kac.yaml here. Run `kac init` first, or pass the workspace path (after a clone, that is usually ./knowledge).",
    );
  }

  const config = parseConfig(parseYaml(workspace.read("kac.yaml")), "kac.yaml");
  const issues = safeValidate(workspace);
  const concepts = workspace.exists(config.paths.concepts)
    ? workspace.walkFiles(config.paths.concepts).filter((p) => p.endsWith(".md") && !p.endsWith("/README.md"))
    : [];

  return STACK_AUDIT.map((check) =>
    runProbe(check, workspace, config, concepts, issues),
  );
}

function safeValidate(workspace: WorkspacePort) {
  try {
    return validateWorkspace(workspace);
  } catch {
    return [];
  }
}

function runProbe(
  check: AuditCheck,
  workspace: WorkspacePort,
  config: ReturnType<typeof parseConfig>,
  concepts: string[],
  issues: ReturnType<typeof validateWorkspace>,
): AuditFinding {
  const fail = issues.some((issue) => issue.severity === "error");
  switch (check.probe) {
    case "markdown-concepts":
      return result(check, concepts.length > 0, concepts.length > 0 ? `${concepts.length} markdown concept(s)` : "No concept files yet");
    case "config-present":
      return result(check, true, "kac.yaml present");
    case "has-concepts":
      return result(check, concepts.length > 0, concepts.length > 0 ? "At least one durable unit exists" : "Write one file worth keeping in concepts/");
    case "index-present":
      return result(check, workspace.exists("index.md"), workspace.exists("index.md") ? "index.md present" : "Missing index.md");
    case "log-or-git":
      return result(check, workspace.exists("log.md"), workspace.exists("log.md") ? "log.md present" : "Missing log.md");
    case "typed-concepts":
      return result(check, !fail && concepts.length > 0, fail ? "Concept type/title issues — run kac validate" : "Concepts declare type");
    case "unique-ids":
      return result(
        check,
        !issues.some((issue) => issue.message.includes("Duplicate concept id")),
        "IDs unique or not yet assigned",
      );
    case "evidence-fields":
      return evidenceFinding(check, workspace, concepts);
    case "retirement-path":
      return result(
        check,
        workspace.exists(config.paths.retired),
        workspace.exists(config.paths.retired) ? "retired/ is ready" : "Create retired/ for annotated withdrawal",
      );
    case "skills-present":
      return result(
        check,
        workspace.exists(config.paths.skills),
        workspace.exists(config.paths.skills) ? "skills/ present" : "Missing skills/",
      );
    case "thin-primer": {
      if (!workspace.exists(config.primer)) {
        return result(check, false, "Primer missing");
      }
      const lines = countEssentialLines(workspace.read(config.primer));
      return result(
        check,
        lines <= config.primer_max_lines,
        `${lines} essential lines (budget ${config.primer_max_lines})`,
      );
    }
    case "owner-named": {
      const named = config.owner.length > 0 && config.owner !== "(unassigned)";
      return result(check, named, named ? `Owner: ${config.owner}` : "Set owner in kac.yaml");
    }
    case "handoff":
      return result(
        check,
        workspace.exists(config.primer) && concepts.length > 0,
        "Primer plus at least one concept",
      );
    case "review-fields":
      return reviewFinding(check, workspace, concepts);
    case "agent-contract":
      return result(
        check,
        workspace.exists("AGENTS.md") || workspace.exists(".cursor/rules/kac-primer.mdc"),
        "AGENTS.md or Cursor primer rule present",
      );
    default:
      return result(check, false, `Unknown probe ${check.probe}`);
  }
}

function evidenceFinding(
  check: AuditCheck,
  workspace: WorkspacePort,
  concepts: string[],
): AuditFinding {
  const found = concepts.some((path) => {
    const data = parseFrontmatter(workspace.read(path)).data;
    return Boolean(data?.confidence || data?.evidence_tier);
  });
  return result(
    check,
    found,
    found ? "At least one concept carries confidence or evidence_tier" : "Add confidence or evidence_tier to claims",
  );
}

function reviewFinding(
  check: AuditCheck,
  workspace: WorkspacePort,
  concepts: string[],
): AuditFinding {
  const found = concepts.some((path) => {
    const data = parseFrontmatter(workspace.read(path)).data;
    return typeof data?.status === "string" && data.status.length > 0;
  });
  return result(
    check,
    found,
    found ? "Review status is in use" : "Set status on concepts before they travel",
  );
}

function result(check: AuditCheck, passed: boolean, detail: string): AuditFinding {
  return { check, passed, detail };
}
