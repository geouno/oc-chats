# OC Chats

Easy frictionless chats with your computer, powered by OpenCode.

## Purpose

OpenCode is designed for agentic coding sessions tied to projects. OC Chats
provides a sandbox for off-topic, quick conversations that don't pollute your
project sessions.

## Quick Start

```bash
# Install globally
bun add -g oc-chats

# Set up OC Chats
chats install

# Start new chat.
chats new

# List and select chat.
chats list

# Resume by ID or prefix.
chats resume abc123
chats resume "my chat"
```

## Features

- Isolated chat environment (~/.oc-chats).
- Full read access, but potentially destructive operations require confirmation.
- Fuzzy search session selection.

## Directory Structure

```
~/.oc-chats/
├── git/                     # Identity repo for session grouping.
│   └── .git/
│       └── opencode         # Project ID marker.
└── .opencode/
    └── opencode.json        # Permission config.
```

## Commands

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `install`               | Set up ~/.oc-chats directory and config.          |
| `new`                   | Start a new chat session.                         |
| `list`                  | List and select chat sessions with fuzzy search.  |
| `resume <ID \| prefix>` | Resume a chat by exact ID or prefix match.        |

## Development

```bash
# Install dependencies.
bun install

# Run in dev mode.
bun run dev

# Build.
bun run build
```
