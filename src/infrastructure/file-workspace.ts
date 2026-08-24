import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import type { WorkspacePort } from "../application/ports.js";

export class FileWorkspace implements WorkspacePort {
  constructor(private readonly root: string) {}

  exists(relPath: string): boolean {
    try {
      statSync(this.abs(relPath));
      return true;
    } catch {
      return false;
    }
  }

  isDirectory(relPath: string): boolean {
    try {
      return statSync(this.abs(relPath)).isDirectory();
    } catch {
      return false;
    }
  }

  list(relPath: string): string[] {
    if (!this.exists(relPath) || !this.isDirectory(relPath)) {
      return [];
    }
    return readdirSync(this.abs(relPath)).filter((name) => name !== ".DS_Store");
  }

  walkFiles(relPath: string): string[] {
    if (!this.exists(relPath)) {
      return [];
    }
    return this.walk(this.abs(relPath)).map((abs) => this.rel(abs));
  }

  read(relPath: string): string {
    return readFileSync(this.abs(relPath), "utf8");
  }

  write(relPath: string, contents: string): void {
    const abs = this.abs(relPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, contents, "utf8");
  }

  private walk(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".DS_Store" || entry.name === ".git") {
        continue;
      }
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        out.push(...this.walk(abs));
      } else {
        out.push(abs);
      }
    }
    return out;
  }

  private abs(relPath: string): string {
    if (relPath === "." || relPath === "") {
      return this.root;
    }
    return join(this.root, ...relPath.split("/"));
  }

  private rel(absPath: string): string {
    return relative(this.root, absPath).split(sep).join("/");
  }
}
