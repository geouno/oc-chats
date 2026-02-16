import { promises as fs } from "fs";
import * as paths from "./paths";

const CONFIG = {
  $schema: "https://opencode.ai/config.json",
  default_agent: "plan",
  permission: {
    read: "allow",
    glob: "allow",
    grep: "allow",
    list: "allow",
    task: "allow",
    skill: "allow",
    lsp: "allow",
    webfetch: "allow",
    websearch: "allow",
    codesearch: "allow",
    external_directory: "allow",
    edit: { "./*": "allow", "*": "deny" },
    bash: "ask",
    todoread: "deny",
    todowrite: "deny",
    doom_loop: "deny",
  },
};

export async function ensureConfigFs() {
  await fs.mkdir(paths.OPENCODE_CONFIG_DIR, { recursive: true });
  await fs.writeFile(paths.OPENCODE_CONFIG, JSON.stringify(CONFIG, null, 2));
}
