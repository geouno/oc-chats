type CommandHandler = (...args: string[]) => Promise<void>;

export const commands: Record<string, CommandHandler> = {
  async install(...args) {
    const { default: cmd } = await import("./install");
    return cmd(...args);
  },
  async new(...args) {
    const { default: cmd } = await import("./new");
    return cmd(...args);
  },
  async list(...args) {
    const { default: cmd } = await import("./list");
    return cmd(...args);
  },
  async resume(...args) {
    const { default: cmd } = await import("./resume");
    return cmd(...args);
  },
};
