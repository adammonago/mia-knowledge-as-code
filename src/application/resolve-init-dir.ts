import { join } from "node:path";

export function resolveInitDirectory(input: {
  explicit: string | undefined;
  cwd: string;
  cwdEmpty: boolean;
}): string {
  if (input.explicit) {
    return input.explicit;
  }
  if (input.cwdEmpty) {
    return input.cwd;
  }
  return join(input.cwd, "knowledge");
}
