export function generateGstInvoicePayload(order) {
  return {
    invoiceNumber: `INV-${order.orderNumber}`,
    orderNumber: order.orderNumber,
    gstin: "29ABCDE1234F1Z9",
    taxableValue: Number(order.subtotal || 0),
    gstRate: 18,
    total: Number(order.total || 0),
    generatedAt: new Date().toISOString(),
  };
}

export function generateInvoicePdfStub(order) {
  return {
    fileName: `${order.orderNumber}.pdf`,
    url: `/invoices/${order.orderNumber}.pdf`,
    payload: generateGstInvoicePayload(order),
  };
}
