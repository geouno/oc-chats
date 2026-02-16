import { spawn } from "child_process";
import * as paths from "../lib/paths";

export default async function (...args: string[]) {
  const proc = spawn("opencode", [], {
    cwd: paths.IDENTITY_REPO,
    stdio: "inherit",
  });
  await new Promise<void>((resolve) => proc.on("close", () => resolve()));
}
