import * as p from "@clack/prompts";
import pc from "picocolors";
import * as readline from "readline";
import { Writable } from "stream";

const silentOutput = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

export const cancelSymbol = Symbol("cancel");

export { cancel, confirm, intro, log, outro, spinner } from "@clack/prompts";

export interface SelectOptions<T> {
  message: string;
  items: SelectItem<T>[];
  maxVisible?: number;
}

export interface SelectItem<T> {
  value: T;
  label: string;
  hint?: string;
}

const S_STEP_ACTIVE = pc.green("◆");
const S_STEP_CANCEL = pc.red("■");
const S_BAR = pc.dim("│");

export async function selectSession<T>(
  options: SelectOptions<T>,
): Promise<T | symbol> {
  const { message, items, maxVisible = 8 } = options;

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: silentOutput,
      terminal: false,
    });

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    readline.emitKeypressEvents(process.stdin, rl);

    let query = "";
    let cursor = 0;
    let lastRenderHeight = 0;

    const filter = (item: SelectItem<T>, q: string): boolean => {
      if (!q) return true;
      const lowerQ = q.toLowerCase();
      return (
        item.label.toLowerCase().includes(lowerQ) ||
        String(item.value).toLowerCase().includes(lowerQ)
      );
    };

    const getFiltered = (): SelectItem<T>[] => {
      return items.filter((item) => filter(item, query));
    };

    const clearRender = (): void => {
      if (lastRenderHeight > 0) {
        process.stdout.write(`\x1b[${lastRenderHeight}A`);
        for (let i = 0; i < lastRenderHeight; i++) {
          process.stdout.write("\x1b[2K\x1b[1B");
        }
        process.stdout.write(`\x1b[${lastRenderHeight}A`);
      }
    };

    const render = (state: "active" | "submit" | "cancel" = "active"): void => {
      clearRender();

      const lines: string[] = [];
      const filtered = getFiltered();

      const icon =
        state === "active"
          ? S_STEP_ACTIVE
          : state === "cancel"
            ? S_STEP_CANCEL
            : "";
      lines.push(`${icon}  ${pc.bold(message)}`);

      if (state === "active") {
        lines.push(`${S_BAR}`);
        lines.push(`${S_BAR}  ${pc.dim("Search:")} ${query}${pc.inverse(" ")}`);
        lines.push(
          `${S_BAR}  ${pc.dim("↑↓ move, enter proceed, esc cancel.")}`,
        );
        lines.push(`${S_BAR}`);

        const visibleStart = Math.max(
          0,
          Math.min(
            cursor - Math.floor(maxVisible / 2),
            filtered.length - maxVisible,
          ),
        );
        const visibleEnd = Math.min(filtered.length, visibleStart + maxVisible);
        const visibleItems = filtered.slice(visibleStart, visibleEnd);

        if (filtered.length === 0) {
          lines.push(`${S_BAR}  ${pc.dim("No matches found.")}`);
        } else {
          for (let i = 0; i < visibleItems.length; i++) {
            const item = visibleItems[i]!;
            const actualIndex = visibleStart + i;
            const isCursor = actualIndex === cursor;

            const label = isCursor ? pc.underline(item.label) : item.label;
            const hint = item.hint ? pc.dim(` (${item.hint})`) : "";

            const prefix = isCursor ? pc.cyan("❯") : " ";
            lines.push(`${S_BAR} ${prefix} ${label}${hint}`);
          }

          const hiddenBefore = visibleStart;
          const hiddenAfter = filtered.length - visibleEnd;
          if (hiddenBefore > 0 || hiddenAfter > 0) {
            const parts: string[] = [];
            if (hiddenBefore > 0) parts.push(`↑ ${hiddenBefore} more`);
            if (hiddenAfter > 0) parts.push(`↓ ${hiddenAfter} more`);
            lines.push(`${S_BAR}  ${pc.dim(parts.join("  "))}`);
          }
        }

        lines.push(`${pc.dim("└")}`);
      } else if (state === "submit") {
        lines.push(`${S_BAR}  ${pc.dim("Selected: ")}`);
      } else if (state === "cancel") {
        lines.push(`${S_BAR}  ${pc.strikethrough(pc.dim("Cancelled."))}`);
      }

      process.stdout.write(lines.join("\n") + "\n");
      lastRenderHeight = lines.length;
    };

    const cleanup = (): void => {
      process.stdin.removeListener("keypress", keypressHandler);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      rl.close();
    };

    const submit = (): void => {
      render("submit");
      cleanup();
      const filtered = getFiltered();
      if (filtered[cursor]) {
        resolve(filtered[cursor].value);
      } else {
        resolve(cancelSymbol);
      }
    };

    const cancel = (): void => {
      render("cancel");
      cleanup();
      resolve(cancelSymbol);
    };

    const keypressHandler = (_str: string, key: readline.Key): void => {
      if (!key) return;

      const filtered = getFiltered();

      if (key.name === "return") {
        submit();
        return;
      }

      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        cancel();
        return;
      }

      if (key.name === "up") {
        cursor = Math.max(0, cursor - 1);
        render();
        return;
      }

      if (key.name === "down") {
        cursor = Math.min(filtered.length - 1, cursor + 1);
        render();
        return;
      }

      if (key.name === "backspace") {
        query = query.slice(0, -1);
        cursor = 0;
        render();
        return;
      }

      if (key.sequence && !key.ctrl && !key.meta && key.sequence.length === 1) {
        query += key.sequence;
        cursor = 0;
        render();
        return;
      }
    };

    process.stdin.on("keypress", keypressHandler);
    render();
  });
}
