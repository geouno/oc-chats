import { execFile, spawn } from "child_process";
import { promisify } from "util";
import * as paths from "./paths";

const execFileAsync = promisify(execFile);

const ENV = {
  ...process.env,
  OPENCODE_CONFIG_DIR: paths.OPENCODE_CONFIG_DIR,
  OPENCODE_DISABLE_PROJECT_CONFIG: "true",
};

export const opencode = {
  spawn(args: string[]) {
    return spawn("opencode", args, {
      cwd: paths.IDENTITY_REPO,
      stdio: "inherit",
      env: ENV,
    });
  },

  async stdout(args: string[]) {
    const { stdout, stderr } = await execFileAsync("opencode", args, {
      cwd: paths.IDENTITY_REPO,
      env: ENV,
    });
    if (stderr) console.error(stderr);
    return stdout;
  },

  async json<T>(args: string[]): Promise<T | null> {
    const stdout = await this.stdout([...args, "--format", "json"]);
    const trimmed = stdout.trim();
    if (!trimmed) return null;
    return JSON.parse(trimmed) as T;
  },
};
