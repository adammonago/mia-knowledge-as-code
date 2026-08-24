export type AuditCheck = {
  id: string;
  layer: "Substrate" | "Semantics" | "System";
  question: string;
  probe: string;
};

export const STACK_AUDIT: AuditCheck[] = [
  {
    id: "sub-1",
    layer: "Substrate",
    question: "Can a human read every durable unit without a vendor UI?",
    probe: "markdown-concepts",
  },
  {
    id: "sub-2",
    layer: "Substrate",
    question: "Would these files still make sense after a tool change?",
    probe: "config-present",
  },
  {
    id: "sub-3",
    layer: "Substrate",
    question: "Is there at least one file worth keeping?",
    probe: "has-concepts",
  },
  {
    id: "sub-4",
    layer: "Substrate",
    question: "Is the bundle listed so an agent can navigate it?",
    probe: "index-present",
  },
  {
    id: "sub-5",
    layer: "Substrate",
    question: "Is change history available outside a chat window?",
    probe: "log-or-git",
  },
  {
    id: "sem-1",
    layer: "Semantics",
    question: "Does each concept declare what kind of thing it is?",
    probe: "typed-concepts",
  },
  {
    id: "sem-2",
    layer: "Semantics",
    question: "Are identifiers unique and stable?",
    probe: "unique-ids",
  },
  {
    id: "sem-3",
    layer: "Semantics",
    question: "Is confidence or evidence visible on claims?",
    probe: "evidence-fields",
  },
  {
    id: "sem-4",
    layer: "Semantics",
    question: "Can wrong knowledge stay in the record without being treated as current?",
    probe: "retirement-path",
  },
  {
    id: "sem-5",
    layer: "Semantics",
    question: "Are anti-patterns and domain conventions on disk, not in chat?",
    probe: "skills-present",
  },
  {
    id: "sys-1",
    layer: "System",
    question: "Does an always-on primer exist, and is it thin?",
    probe: "thin-primer",
  },
  {
    id: "sys-2",
    layer: "System",
    question: "Is someone named as owner of the attention budget?",
    probe: "owner-named",
  },
  {
    id: "sys-3",
    layer: "System",
    question: "Would a new person or agent session work without a hallway conversation?",
    probe: "handoff",
  },
  {
    id: "sys-4",
    layer: "System",
    question: "Is review status or origin required before a claim can travel?",
    probe: "review-fields",
  },
  {
    id: "sys-5",
    layer: "System",
    question: "Do agents load the primer instead of dumping the vault?",
    probe: "agent-contract",
  },
];
