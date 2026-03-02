export function logInfo(message, meta = {}) {
  console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta);
}

export function logError(message, meta = {}) {
  console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta);
}
