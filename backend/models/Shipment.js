export function createShipmentRecord(payload) {
  return {
    id: `shp_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
}
