import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ToolkitError } from "../domain/types.js";
import type { TemplatePort } from "../application/ports.js";

export class FileTemplates implements TemplatePort {
  constructor(private readonly root: string) {}

  load(name: string): string {
    try {
      return readFileSync(join(this.root, name), "utf8");
    } catch {
      throw new ToolkitError("template", `Missing template: ${name}`);
    }
  }
}

export function packageTemplateRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "..", "..", "templates", "workspace");
}
