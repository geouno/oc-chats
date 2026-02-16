import { opencodeJSON } from "./exec";
import * as paths from "./paths";

export interface Session {
  id: string;
  title: string;
  updated: number;
  created: number;
  projectId: string;
  directory: string;
}

export async function getChatsSessions(): Promise<Session[]> {
  const sessions = (await opencodeJSON<Session[]>(["session", "list"])) ?? [];
  return sessions.filter((s) => s.projectId === paths.PROJECT_ID);
}

export async function findByPrefix(prefix: string): Promise<Session[]> {
  const sessions = await getChatsSessions();
  return sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(prefix.toLowerCase()) ||
      s.id.startsWith(prefix),
  );
}

export async function findById(id: string): Promise<Session | undefined> {
  const sessions = await getChatsSessions();
  return sessions.find((s) => s.id === id);
}
