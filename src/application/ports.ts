export interface WorkspacePort {
  exists(relPath: string): boolean;
  isDirectory(relPath: string): boolean;
  list(relPath: string): string[];
  walkFiles(relPath: string): string[];
  read(relPath: string): string;
  write(relPath: string, contents: string): void;
}

export interface TemplatePort {
  load(name: string): string;
}

export type InitInput = {
  title: string;
  domain: string;
  scale: "solo" | "team";
  owner: string;
  withSkills: boolean;
  force: boolean;
  today: string;
};

export type InitResult = {
  created: string[];
};

export type NewKind = "concept" | "retirement" | "skill";
