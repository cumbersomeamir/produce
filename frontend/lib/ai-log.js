const globalState = globalThis;

globalState.__aiActionLogs = globalState.__aiActionLogs || [];

export function logAiAction(entry) {
  globalState.__aiActionLogs.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
}

export function listAiActions() {
  return globalState.__aiActionLogs;
}
