import { join } from "node:path";

export function resolveWorkspaceDirectory(input: {
  requested: string;
  hasKacYaml: (dir: string) => boolean;
}): string {
  if (input.hasKacYaml(input.requested)) {
    return input.requested;
  }
  const nested = join(input.requested, "knowledge");
  if (input.hasKacYaml(nested)) {
    return nested;
  }
  return input.requested;
}
