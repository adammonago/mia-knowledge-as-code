import { ToolkitError } from "./types.js";
import type { Scale, WorkspaceConfig } from "./types.js";

export function defaultConfig(input: {
  title: string;
  domain: string;
  scale: Scale;
  owner: string;
}): WorkspaceConfig {
  return {
    version: 1,
    title: input.title,
    domain: input.domain,
    scale: input.scale,
    primer: "primer.md",
    primer_max_lines: 80,
    paths: {
      concepts: "concepts",
      retired: "retired",
      skills: "skills",
    },
    owner: input.owner,
  };
}

export function parseConfig(value: unknown, path: string): WorkspaceConfig {
  if (!isRecord(value)) {
    throw new ToolkitError("config", `${path} is not a YAML mapping.`);
  }
  const title = requiredString(value, "title", path);
  const domain = requiredString(value, "domain", path);
  const scale = value.scale;
  if (scale !== "solo" && scale !== "team") {
    throw new ToolkitError("config", `${path} scale must be "solo" or "team".`);
  }
  const primer = optionalString(value.primer) ?? "primer.md";
  const primerMax = value.primer_max_lines;
  const primer_max_lines =
    typeof primerMax === "number" && primerMax > 0 ? primerMax : 80;
  const pathsValue = isRecord(value.paths) ? value.paths : {};
  return {
    version: 1,
    title,
    domain,
    scale,
    primer,
    primer_max_lines,
    paths: {
      concepts: optionalString(pathsValue.concepts) ?? "concepts",
      retired: optionalString(pathsValue.retired) ?? "retired",
      skills: optionalString(pathsValue.skills) ?? "skills",
    },
    owner: optionalString(value.owner) ?? "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: Record<string, unknown>,
  key: string,
  path: string,
): string {
  const raw = value[key];
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new ToolkitError("config", `${path} is missing "${key}".`);
  }
  return raw.trim();
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return value.trim();
}
