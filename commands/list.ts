import * as p from "@clack/prompts";
import { spawn } from "child_process";
import * as paths from "../lib/paths";
import { cancelSymbol, confirm, selectSession } from "../lib/prompts";
import { getChatsSessions } from "../lib/sessions";

export default async function (...args: string[]) {
  p.intro("OC Chats - All sessions.");

  const sessions = await getChatsSessions();
  if (sessions.length === 0) {
    p.outro("No sessions found. Run 'chats new' to start.");
    return;
  }

  const selected = await selectSession({
    message: "Select a session.",
    items: sessions.map((s) => ({
      value: s,
      label: s.title,
      hint: `Updated: ${new Date(s.updated).toLocaleDateString()}`,
    })),
  });

  if (selected === cancelSymbol || typeof selected === "symbol") {
    p.cancel("Cancelled.");
    return;
  }

  p.log.info(
    [
      `ID:        ${selected.id}`,
      `Title:     ${selected.title}`,
      `Created:   ${new Date(selected.created).toLocaleString()}`,
      `Updated:   ${new Date(selected.updated).toLocaleString()}`,
      `Project:   ${selected.projectId}`,
      `Directory: ${selected.directory}`,
    ].join("\n"),
  );

  const shouldResume = await confirm({
    message: "Resume this session?",
    initialValue: false,
  });

  if (shouldResume) {
    const proc = spawn("opencode", ["-s", selected.id], {
      cwd: paths.IDENTITY_REPO,
      stdio: "inherit",
    });
    await new Promise<void>((resolve) => proc.on("close", () => resolve()));
  } else {
    p.outro(
      `Listed ${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}.`,
    );
  }
}
