export function renderTemplate(
  source: string,
  vars: Record<string, string>,
): string {
  return source.replace(/\{\{([a-z_]+)\}\}/g, (match, key: string) => {
    return Object.hasOwn(vars, key) ? (vars[key] ?? "") : match;
  });
}

export function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ownershipNote(scale: "solo" | "team"): string {
  if (scale === "team") {
    return "Name an owner in kac.yaml. An unowned primer rots, and agents fall back to the average of the internet.";
  }
  return "You own this primer. Review it when a rule goes stale; do not let it grow past the line budget.";
}
