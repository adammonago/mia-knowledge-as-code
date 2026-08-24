import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFrontmatter } from "./frontmatter.js";

test("parses YAML frontmatter and leaves the body", () => {
  const parsed = parseFrontmatter("---\ntype: Claim\ntitle: Hello\n---\n\nBody text\n");
  assert.equal(parsed.data?.type, "Claim");
  assert.equal(parsed.data?.title, "Hello");
  assert.match(parsed.body, /Body text/);
});

test("files without frontmatter are still readable", () => {
  const parsed = parseFrontmatter("# Just a note\n");
  assert.equal(parsed.data, null);
});
