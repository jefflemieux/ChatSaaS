// sanitize.ts
import type { UIMessage } from "ai";

// keep only allowed part types and fields; drop UI-only stuff
function cleanPart(p: any): any | null {
  if (p?.type === "text") return { type: "text", text: String(p.text ?? "") };

  if (p.type === "file" && p.filename) {
    return p;
  }

  // tool calls: strip provider metadata
  if (p?.type === "tool-call" && p.toolCallId && p.toolName) {
    return {
      type: "tool-call",
      toolCallId: String(p.toolCallId),
      toolName: String(p.toolName),
      input: p.input ?? {},
    };
  }

  // tool results: coerce output to plain text
  if (p?.type === "tool-result" && p.toolCallId && p.toolName) {
    const out = p.output;
    const text =
      typeof out === "string"
        ? out
        : typeof out?.value === "string"
          ? out.value
          : JSON.stringify(out ?? "");
    return {
      type: "tool-result",
      toolCallId: String(p.toolCallId),
      toolName: String(p.toolName),
      result: { type: "text", text },
    };
  }

  // drop UI-only parts like "reasoning", files with bad shapes, etc.
  return null;
}

export function sanitizeUiMessages(msgs: UIMessage[]): UIMessage[] {
  return msgs.map((m) => ({
    id: m.id,
    role: m.role, // "user" | "assistant" | "tool" | "system"
    parts: (m.parts ?? []).map(cleanPart).filter(Boolean) as any[],
  }));
}
