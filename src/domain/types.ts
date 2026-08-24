export type Scale = "solo" | "team";

export type WorkspaceConfig = {
  version: 1;
  title: string;
  domain: string;
  scale: Scale;
  primer: string;
  primer_max_lines: number;
  paths: {
    concepts: string;
    retired: string;
    skills: string;
  };
  owner: string;
};

export type ConceptFrontmatter = {
  type: string;
  title: string;
  id?: string;
  status?: string;
  confidence?: string;
  evidence_tier?: string;
  description?: string;
  [key: string]: unknown;
};

export type RetirementFields = {
  stopped_asserting: string;
  why: string;
  falsifiers: string;
  redirects_to?: string[];
};

export class ToolkitError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ToolkitError";
    this.code = code;
  }
}

export type Issue = {
  path: string;
  message: string;
  severity: "error" | "warning";
};
