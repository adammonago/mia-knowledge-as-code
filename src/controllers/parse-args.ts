import type { NewKind } from "../application/ports.js";
import type { Scale } from "../domain/types.js";
import { ToolkitError } from "../domain/types.js";

export type ParsedArgs =
  | {
      command: "init";
      dir?: string;
      title?: string;
      domain?: string;
      scale: Scale;
      owner: string;
      yes: boolean;
      force: boolean;
      withSkills: boolean;
    }
  | { command: "validate"; dir: string }
  | { command: "audit"; dir: string }
  | { command: "new"; kind: NewKind; slug: string; dir: string }
  | { command: "help" }
  | { command: "version" };

const NEW_KINDS = new Set<NewKind>(["concept", "retirement", "skill"]);
const BOOLEAN_FLAGS = new Set(["yes", "y", "force", "no-skills", "help", "h", "version", "v"]);

export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.filter((item) => item.length > 0);
  if (
    args.length === 0 ||
    args[0] === "help" ||
    args.includes("-h") ||
    args.includes("--help")
  ) {
    return { command: "help" };
  }
  if (args[0] === "version" || args[0] === "--version" || args[0] === "-v") {
    return { command: "version" };
  }

  const command = args[0];
  const rest = args.slice(1);
  if (command === "init") {
    return parseInit(rest);
  }
  if (command === "validate") {
    return { command: "validate", dir: positionals(rest)[0] ?? "." };
  }
  if (command === "audit") {
    return { command: "audit", dir: positionals(rest)[0] ?? "." };
  }
  if (command === "new") {
    return parseNew(rest);
  }
  throw new ToolkitError("args", `Unknown command "${command}". Try kac init`);
}

function parseInit(rest: string[]): ParsedArgs {
  const flags = flagMap(rest);
  const scaleRaw = flags.get("scale") ?? "solo";
  if (scaleRaw !== "solo" && scaleRaw !== "team") {
    throw new ToolkitError("args", '--scale must be "solo" or "team".');
  }
  return {
    command: "init",
    dir: positionals(rest)[0],
    title: flags.get("name") ?? flags.get("title"),
    domain: flags.get("domain"),
    scale: scaleRaw,
    owner: flags.get("owner") ?? "",
    yes: flags.has("yes") || flags.has("y"),
    force: flags.has("force"),
    withSkills: !flags.has("no-skills"),
  };
}

function parseNew(rest: string[]): ParsedArgs {
  const flags = flagMap(rest);
  const values = positionals(rest);
  const kind = values[0];
  const slug = values[1];
  if (!kind || !NEW_KINDS.has(kind as NewKind) || !slug) {
    throw new ToolkitError("args", "Usage: kac new <concept|retirement|skill> <slug>");
  }
  return {
    command: "new",
    kind: kind as NewKind,
    slug,
    dir: flags.get("dir") ?? ".",
  };
}

function positionals(rest: string[]): string[] {
  const values: string[] = [];
  for (let i = 0; i < rest.length; i += 1) {
    const item = rest[i];
    if (!item) {
      continue;
    }
    if (item.startsWith("-")) {
      const name = item.replace(/^--?/, "").split("=")[0] ?? "";
      if (!item.includes("=") && !BOOLEAN_FLAGS.has(name)) {
        i += 1;
      }
      continue;
    }
    values.push(item);
  }
  return values;
}

function flagMap(rest: string[]): Map<string, string> {
  const flags = new Map<string, string>();
  for (let i = 0; i < rest.length; i += 1) {
    const item = rest[i];
    if (!item?.startsWith("-")) {
      continue;
    }
    const trimmed = item.replace(/^--?/, "");
    if (trimmed.includes("=")) {
      const [key, value] = trimmed.split("=", 2);
      if (key) {
        flags.set(key, value ?? "");
      }
      continue;
    }
    if (BOOLEAN_FLAGS.has(trimmed)) {
      flags.set(trimmed, "true");
      continue;
    }
    const next = rest[i + 1];
    if (next && !next.startsWith("-")) {
      flags.set(trimmed, next);
      i += 1;
      continue;
    }
    flags.set(trimmed, "true");
  }
  return flags;
}
