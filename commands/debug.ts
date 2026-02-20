import * as p from "@clack/prompts";
import pc from "picocolors";
import { opencode } from "../lib/opencode";

const OPENCODE_DEBUG_SUBCOMMANDS = [
  "config",
  "paths",
  "skill",
  "scrap",
  "agent",
  "lsp",
  "rg",
  "file",
  "snapshot",
  "wait",
] as const;

type OpenCodeDebugCmd = (typeof OPENCODE_DEBUG_SUBCOMMANDS)[number];

export default async function debug(...args: string[]): Promise<void> {
  const [scope, ...rest] = args;

  switch (scope) {
    case "opencode": {
      const [subcommand, ...subArgs] = rest;

      if (!subcommand) {
        console.error("Usage: chats debug opencode <command>");
        console.error("\nAvailable commands:");
        for (const cmd of OPENCODE_DEBUG_SUBCOMMANDS) {
          console.error(`  ${cmd}`);
        }
        process.exit(1);
      }

      if (subcommand === "exec") {
        const child = opencode.spawn(subArgs);
        child.on("exit", (code) => process.exit(code ?? 0));
        return;
      }

      if (
        !OPENCODE_DEBUG_SUBCOMMANDS.includes(subcommand as OpenCodeDebugCmd)
      ) {
        p.log.warn(`Unknown opencode debug command: ${subcommand}`);
        p.log.message(`Available: ${OPENCODE_DEBUG_SUBCOMMANDS.join(", ")}`);
        p.log.message(
          pc.dim(
            "Open a PR to update us on this: https://github.com/geouno/oc-chats",
          ),
        );

        const shouldContinue = await p.confirm({
          message: "Run anyway?",
          initialValue: false,
        });

        if (shouldContinue === false || p.isCancel(shouldContinue)) {
          process.exit(0);
        }
      }

      const child = opencode.spawn(["debug", subcommand, ...subArgs]);
      child.on("exit", (code) => process.exit(code ?? 0));
      return;
    }

    default:
      console.error(`Unknown debug scope: ${scope ?? "(none)"}`);
      console.error("Available scopes: opencode");
      process.exit(1);
  }
}
