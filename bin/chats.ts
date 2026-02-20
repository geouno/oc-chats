#!/usr/bin/env node
import { commands } from "../commands";

const [command, ...args] = process.argv.slice(2);

const handler = commands[command as keyof typeof commands];
if (!handler) {
  if (command) console.error("Unknown command:", command);
  console.error("\nAvailable commands:");
  console.error("  install  - Set up OC Chats directory and config.");
  console.error("  new      - Start a new chat.");
  console.error("  list     - List and select chat sessions.");
  console.error("  resume   - Resume a chat (by ID or prefix).");
  console.error("  debug    - Debug tools (opencode, ...).");
  process.exit(1);
}

await handler(...args).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
