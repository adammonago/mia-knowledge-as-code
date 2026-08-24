#!/usr/bin/env node

import { stdin as stdinStream } from "node:process";
import { createInterface } from "node:readline/promises";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { auditWorkspace } from "./application/audit-workspace.js";
import { initWorkspace } from "./application/init-workspace.js";
import { newArtifact } from "./application/new-artifact.js";
import { resolveInitDirectory } from "./application/resolve-init-dir.js";
import { validateWorkspace } from "./application/validate-workspace.js";
import { parseArgs } from "./controllers/parse-args.js";
import { ToolkitError } from "./domain/types.js";
import { FileTemplates, packageTemplateRoot } from "./infrastructure/file-templates.js";
import { FileWorkspace } from "./infrastructure/file-workspace.js";

const VERSION = "0.1.0";

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.command === "help") {
    process.stdout.write(helpText());
    return;
  }
  if (parsed.command === "version") {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const templates = new FileTemplates(packageTemplateRoot());

  if (parsed.command === "init") {
    await runInit(parsed, templates);
    return;
  }
  if (parsed.command === "validate") {
    runValidate(resolve(parsed.dir));
    return;
  }
  if (parsed.command === "audit") {
    runAudit(resolve(parsed.dir));
    return;
  }
  runNew(parsed, templates);
}

async function runInit(
  parsed: Extract<ReturnType<typeof parseArgs>, { command: "init" }>,
  templates: FileTemplates,
): Promise<void> {
  const cwd = process.cwd();
  const target = resolve(
    resolveInitDirectory({
      explicit: parsed.dir,
      cwd,
      cwdEmpty: isEmptyDir(cwd),
    }),
  );
  const answers = await collectInitAnswers(parsed, target);
  const workspace = new FileWorkspace(target);
  const result = initWorkspace(workspace, templates, {
    title: answers.title,
    domain: answers.domain,
    scale: parsed.scale,
    owner: parsed.owner,
    withSkills: parsed.withSkills,
    force: parsed.force,
    today: today(),
  });
  process.stdout.write(initSuccess(target, result.created.length));
}

async function collectInitAnswers(
  parsed: Extract<ReturnType<typeof parseArgs>, { command: "init" }>,
  target: string,
): Promise<{ title: string; domain: string }> {
  const fallbackTitle = titleFromPath(target);
  const fallbackDomain = "Institutional memory that should survive a tool change.";
  if (parsed.yes || (parsed.title && parsed.domain) || !stdinStream.isTTY) {
    return {
      title: parsed.title ?? fallbackTitle,
      domain: parsed.domain ?? fallbackDomain,
    };
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const title =
      parsed.title ??
      emptyToFallback(await rl.question(`Workspace title [${fallbackTitle}]: `), fallbackTitle);
    const domain =
      parsed.domain ??
      emptyToFallback(
        await rl.question("What should this workspace remember? (one sentence): "),
        fallbackDomain,
      );
    return { title, domain };
  } finally {
    rl.close();
  }
}

function runValidate(dir: string): void {
  const issues = validateWorkspace(new FileWorkspace(dir));
  if (issues.length === 0) {
    process.stdout.write("Valid. Substrate, semantics, and primer checks passed.\n");
    return;
  }
  for (const issue of issues) {
    process.stdout.write(`${issue.severity.toUpperCase()} ${issue.path}: ${issue.message}\n`);
  }
  const errors = issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

function runAudit(dir: string): void {
  const findings = auditWorkspace(new FileWorkspace(dir));
  let failed = 0;
  let layer = "";
  for (const finding of findings) {
    if (finding.check.layer !== layer) {
      layer = finding.check.layer;
      process.stdout.write(`\n${layer}\n`);
    }
    const mark = finding.passed ? "PASS" : "GAP";
    if (!finding.passed) {
      failed += 1;
    }
    process.stdout.write(`  ${mark}  ${finding.check.question}\n          ${finding.detail}\n`);
  }
  process.stdout.write(
    failed === 0
      ? "\nStack audit clear. Keep the primer thin and the retirement trail readable.\n"
      : `\n${failed} gap(s). Files can be fixed with kac validate; questions still need a named owner.\n`,
  );
}

function runNew(
  parsed: Extract<ReturnType<typeof parseArgs>, { command: "new" }>,
  templates: FileTemplates,
): void {
  const dest = newArtifact(
    new FileWorkspace(resolve(parsed.dir)),
    templates,
    parsed.kind,
    parsed.slug,
    today(),
  );
  process.stdout.write(`Created ${dest}\n`);
}

function initSuccess(target: string, created: number): string {
  return [
    `Knowledge as Code workspace ready at ${target}`,
    `Wrote ${created} files.`,
    "",
    "Next:",
    "  1. Edit primer.md (keep it thin)",
    "  2. Replace concepts/getting-started.md with one file worth keeping",
    "  3. Point your agent at AGENTS.md",
    "",
    "Then: kac validate   and   kac audit",
    "",
  ].join("\n");
}

function helpText(): string {
  return `kac — Knowledge as Code toolkit

Usage:
  kac init [dir]     Create a workspace in seconds
  kac new            Add a concept, retirement record, or skill
  kac validate [dir] Lint frontmatter, IDs, primer budget, retirement fields
  kac audit [dir]    Probe The Knowledge Stack (Substrate / Semantics / System)

Init options:
  --name <title>     Workspace title
  --domain <text>    One sentence: what this memory is for
  --scale solo|team  Ownership language (default: solo)
  --owner <name>     Named owner of the primer
  --no-skills        Skip agent skills and Cursor rule
  --yes, -y          No prompts; use defaults
  --force            Allow a non-empty directory

New:
  kac new concept <slug>
  kac new retirement <slug>
  kac new skill <slug>

If you omit [dir] and the current folder already has files, init creates ./knowledge
so it will not clutter an existing project.
`;
}

function isEmptyDir(dir: string): boolean {
  try {
    return readdirSync(dir).filter((name) => name !== ".DS_Store").length === 0;
  } catch {
    return false;
  }
}

function titleFromPath(path: string): string {
  const base = path.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? "knowledge";
  return base
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function emptyToFallback(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

main().catch((error: unknown) => {
  const message = error instanceof ToolkitError ? error.message : error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
