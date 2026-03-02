export async function processAbandonedCartJob() {
  return { queuedEmails: 0, processedAt: new Date().toISOString() };
}
