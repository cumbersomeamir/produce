export async function processPriceDropAlertJob() {
  return { alertsSent: 0, processedAt: new Date().toISOString() };
}
