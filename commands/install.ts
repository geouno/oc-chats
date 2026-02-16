import * as p from "@clack/prompts";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";
import { ensureConfigFs } from "../lib/config";
import * as paths from "../lib/paths";

const execFileAsync = promisify(execFile);

export default async function (...args: string[]) {
  try {
    await fs.access(paths.OC_CHATS_DIR, fs.constants.F_OK);
    p.outro("OC Chats is already installed.");
    return;
  } catch {}

  p.intro("Setting up OC Chats.");

  const s = p.spinner();
  s.start("Creating config files.");
  await ensureConfigFs();
  s.stop("Config files created.");

  s.start("Initializing git repository.");
  await fs.mkdir(paths.IDENTITY_REPO, { recursive: true });
  await execFileAsync("git", ["init"], { cwd: paths.IDENTITY_REPO });
  await fs.writeFile(
    path.join(paths.IDENTITY_REPO, ".git", "opencode"),
    paths.PROJECT_ID,
  );
  s.stop("Git repository initialized.");

  p.outro("OC Chats installed.");
}
