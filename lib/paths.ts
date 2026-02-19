import path from "path";
import os from "os";

export const HOME = os.homedir();

export const OC_CHATS_DIR = path.join(HOME, ".oc-chats");

export const IDENTITY_REPO = path.join(OC_CHATS_DIR, "identity-repository");
export const PROJECT_ID = "OC_CHATS_PROJECT";

export const CONFIG_DIR = path.join(OC_CHATS_DIR, "config");
export const OPENCODE_CONFIG_DIR = path.join(CONFIG_DIR, "opencode");
export const OPENCODE_CONFIG = path.join(OPENCODE_CONFIG_DIR, "opencode.json");
