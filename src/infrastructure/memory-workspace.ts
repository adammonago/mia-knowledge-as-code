import type { WorkspacePort } from "../application/ports.js";

export class MemoryWorkspace implements WorkspacePort {
  private readonly files = new Map<string, string>();

  exists(relPath: string): boolean {
    if (relPath === "." || relPath === "") {
      return true;
    }
    if (this.files.has(relPath)) {
      return true;
    }
    const prefix = relPath.endsWith("/") ? relPath : `${relPath}/`;
    for (const path of this.files.keys()) {
      if (path.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  isDirectory(relPath: string): boolean {
    if (relPath === "." || relPath === "") {
      return true;
    }
    if (this.files.has(relPath)) {
      return false;
    }
    return this.exists(relPath);
  }

  list(relPath: string): string[] {
    const names = new Set<string>();
    const prefix = relPath === "." || relPath === "" ? "" : `${relPath}/`;
    for (const path of this.files.keys()) {
      if (prefix && !path.startsWith(prefix)) {
        continue;
      }
      const rest = prefix ? path.slice(prefix.length) : path;
      const head = rest.split("/")[0];
      if (head) {
        names.add(head);
      }
    }
    return [...names];
  }

  walkFiles(relPath: string): string[] {
    if (relPath === "." || relPath === "") {
      return [...this.files.keys()];
    }
    const prefix = `${relPath}/`;
    return [...this.files.keys()].filter((path) => path.startsWith(prefix) || path === relPath);
  }

  read(relPath: string): string {
    const value = this.files.get(relPath);
    if (value === undefined) {
      throw new Error(`Missing file: ${relPath}`);
    }
    return value;
  }

  write(relPath: string, contents: string): void {
    this.files.set(relPath, contents);
  }

  snapshot(): Map<string, string> {
    return new Map(this.files);
  }
}
