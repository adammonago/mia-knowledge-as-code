import { parse as parseYaml } from "yaml";

export type FrontmatterDocument = {
  data: Record<string, unknown> | null;
  body: string;
};

export function parseFrontmatter(text: string): FrontmatterDocument {
  if (!text.startsWith("---")) {
    return { data: null, body: text };
  }
  const rest = text.slice(3);
  const end = rest.search(/\r?\n---\r?\n/);
  if (end === -1) {
    return { data: null, body: text };
  }
  const raw = rest.slice(0, end);
  const body = rest.slice(end).replace(/^\r?\n---\r?\n/, "");
  const parsed: unknown = parseYaml(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { data: null, body };
  }
  return { data: parsed as Record<string, unknown>, body };
}
