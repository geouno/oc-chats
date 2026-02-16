import { execFile } from "child_process";
import { promisify } from "util";
import * as paths from "./paths";

const execFileAsync = promisify(execFile);

export async function opencode(args: string[]) {
  const { stdout, stderr } = await execFileAsync("opencode", args, {
    cwd: paths.IDENTITY_REPO,
  });
  if (stderr) console.error(stderr);
  return stdout;
}

export async function opencodeJSON<T>(args: string[]): Promise<T | null> {
  const stdout = await opencode([...args, "--format", "json"]);
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as T;
}
