import fs from 'fs';
import path from 'path';

let hasLoadedLocalEnv = false;

function parseEnvValue(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lines = fileContents.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1);

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = parseEnvValue(rawValue);
  }
}

export function loadLocalEnv() {
  if (hasLoadedLocalEnv) {
    return;
  }

  const projectRoot = process.cwd();

  // Preserve explicit shell/CI env values and only fill missing entries from local files.
  loadEnvFile(path.resolve(projectRoot, '.env'));
  loadEnvFile(path.resolve(projectRoot, '.env.local'));

  hasLoadedLocalEnv = true;
}
