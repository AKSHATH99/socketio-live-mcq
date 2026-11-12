const fs = require("fs");
const path = require("path");

/**
 * Minimal .env loader.
 *
 * Why this exists instead of `node --env-file=.env`:
 * `--env-file` makes Node exit with "node: .env: not found" when the file is
 * missing, which crashes deployments that inject env vars through the host
 * (Render, Docker, CI). `--env-file-if-exists` is newer and not available on
 * every Node version we may run on, so we load the file ourselves instead.
 *
 * Values already present in `process.env` always win, so platform-provided
 * variables override anything in the local file.
 */

const parseEnvFile = (contents) => {
  const parsed = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) continue;

    const withoutExport = line.startsWith("export ") ? line.slice(7).trim() : line;
    const separatorIndex = withoutExport.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = withoutExport.slice(0, separatorIndex).trim();

    if (!key) continue;

    let value = withoutExport.slice(separatorIndex + 1).trim();

    const isQuoted =
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1);

    if (isQuoted) {
      value = value.slice(1, -1);
    } else {
      // Strip trailing inline comment for unquoted values
      const commentIndex = value.indexOf(" #");

      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    parsed[key] = value;
  }

  return parsed;
};

const applyEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;

  const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));

  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return true;
};

const loadEnv = (options = {}) => {
  // Optional override, e.g. ENV_FILE=socketio-live-mcq.env
  const fileName = options.fileName || process.env.ENV_FILE || ".env";
  const filePath = options.filePath || path.resolve(process.cwd(), fileName);
  const loaded = applyEnvFile(filePath);

  if (loaded) {
    console.log(`[env] Loaded ${fileName} (existing environment variables take precedence).`);
  } else {
    console.log(`[env] ${fileName} not found, using existing environment variables only.`);
  }

  return loaded;
};

module.exports = { loadEnv, parseEnvFile };
