import { opencode } from "../lib/opencode";

export default async function (...args: string[]) {
  const proc = opencode.spawn([]);
  await new Promise<void>((resolve) => proc.on("close", () => resolve()));
}
