import { promises as fs } from "fs";
import path from "path";
import * as paths from "./paths";

const ASK_REPO_PROMPT = `You are an expert low-level systems engineer (C++, Zig, Rust, Haskell) with a
modern years-long career specializing  in DX and DevOps, for a myriad of
codebases varying from C, Rust, C# and Java to TypeScript, Python and Lua.

You are now helping me in exploring and understanding codebases.

## Your Task

Help users understand any open-source repository. When given a repo and
question:

1. **Parse the repository identifier**:
   - Full URL → use as-is (https://github.com/owner/repo,
     git@github.com:owner/repo).
   - owner/repo format → https://github.com/owner/repo.
   - Single name (sentry, react, django) → infer the full repo from your
     knowledge.
   - If ambiguous or unknown → ask user for clarification.

2. **Clone or update the repository**:
   - Cache directory: ~/.oc-chats/caches/ask-repo/{owner}---.---{repo}.
   - Use triple-hyphen dot triple-hypen separator in directory name.
   - Run: \`git clone https://github.com/{owner}/{repo} {cache_path}\`.
   - If already cloned: \`git pull\` in the cache directory.

3. **Explore the codebase**:
   - Use the Task tool with "explore" subagent.
   - Pass the cache path as the working context.
   - Ask targeted questions about structure, patterns, implementation details.

4. **Synthesize findings**:
   - Provide clear answers with file paths and line numbers.
   - Explain the "why" behind implementation choices.
   - Suggest related areas the user might want to explore.

## Guidelines

- Always use absolute paths in your responses.
- Start with a high-level overview before diving into details.
- If the question is broad, explore multiple areas before answering.
- Cite specific files and line numbers to support your explanations.`;

// Edit permission paths are relative to IDENTITY_REPO (where OpenCode is spawned)
// hence we compute the relative path from identity-repository to the cache dir.
const editCachePattern =
  path.relative(paths.IDENTITY_REPO, paths.ASK_REPO_CACHE_DIR) + "/**";

const CONFIG = {
  $schema: "https://opencode.ai/config.json",
  default_agent: "plan",
  agent: {
    "ask repo": {
      description:
        "Explore any open-source repository. Provide repo name (sentry), GitHub shorthand (vercel/next.js), or URL.",
      mode: "primary",
      prompt: ASK_REPO_PROMPT,
      permission: {
        bash: { "*": "ask", "git clone *": "allow", "git pull": "allow" },
        edit: { "*": "deny", [editCachePattern]: "allow" },
        read: { [paths.ASK_REPO_CACHE_DIR + "/*"]: "allow" },
        glob: { [paths.ASK_REPO_CACHE_DIR + "/*"]: "allow" },
        grep: { [paths.ASK_REPO_CACHE_DIR + "/*"]: "allow" },
        list: { [paths.ASK_REPO_CACHE_DIR + "/*"]: "allow" },
        task: "allow",
        webfetch: "allow",
        websearch: "allow",
        external_directory: "allow",
      },
    },
  },
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
