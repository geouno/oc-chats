import * as p from "@clack/prompts";
import { spawn } from "child_process";
import * as paths from "../lib/paths";
import { cancelSymbol, selectSession } from "../lib/prompts";
import {
  findById,
  findByPrefix,
  getChatsSessions,
  type Session,
} from "../lib/sessions";

export default async function (...args: string[]) {
  p.intro("OC Chats - Resume session.");

  const identifier = args[0];
  let sessions: Session[];

  if (!identifier) {
    sessions = await getChatsSessions();
  } else {
    sessions = await findByPrefix(identifier);
    if (sessions.length === 1) {
      return await openSession(sessions[0].id);
    }

    const byId = await findById(identifier);
    if (byId) {
      return await openSession(byId.id);
    }
  }

  if (sessions.length === 0) {
    p.outro("No matching sessions found.");
    return;
  }

  const selected = await selectSession({
    message: "Select a chat to resume.",
    items: sessions.map((s) => ({ value: s.id, label: s.title, hint: s.id })),
  });

  if (selected === cancelSymbol) {
    p.cancel("Cancelled.");
    return;
  }

  if (typeof selected !== "symbol" && selected) {
    await openSession(selected);
  }
}

async function openSession(sessionId: string) {
  const proc = spawn("opencode", ["-s", sessionId], {
    cwd: paths.IDENTITY_REPO,
    stdio: "inherit",
  });
  await new Promise<void>((resolve) => proc.on("close", () => resolve()));
}
