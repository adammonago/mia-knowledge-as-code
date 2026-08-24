import type { Issue } from "./types.js";

export function countEssentialLines(text: string): number {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("<!--"))
    .length;
}

export function primerIssues(
  path: string,
  text: string,
  maxLines: number,
): Issue[] {
  const lines = countEssentialLines(text);
  if (lines <= maxLines) {
    return [];
  }
  return [
    {
      path,
      severity: "error",
      message: `Primer has ${lines} essential lines; budget is ${maxLines}. Move procedures into skills/ so the always-on packet stays an attention budget.`,
    },
  ];
}
