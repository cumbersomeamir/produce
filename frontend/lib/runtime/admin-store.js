import { reviews as seedReviews } from "@/lib/mock-data";

const ADMIN_KEY = "__ODDFINDS_RUNTIME_ADMIN__";

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function getStore() {
  if (!globalThis[ADMIN_KEY]) {
    globalThis[ADMIN_KEY] = {
      customers: [
        { id: "usr_1", email: "customer1@oddfinds.com", name: "Test Customer One", tier: "REGULAR" },
        { id: "usr_2", email: "customer2@oddfinds.com", name: "Test Customer Two", tier: "VIP" },
      ],
      discounts: [
        { id: "disc_1", code: "ODDWEEK", type: "PERCENTAGE", value: 15, active: true },
        { id: "disc_2", code: "FIRSTBUY", type: "FIXED_AMOUNT", value: 200, active: true },
        { id: "disc_3", code: "FREESHIP", type: "FREE_SHIPPING", value: 0, active: true },
      ],
      orders: [
        {
          orderNumber: "ODF-104932",
          status: "PENDING",
          total: 2199,
          payment: "CAPTURED",
          trackingNumber: "",
          deliveryPartner: "",
          customerEmail: "customer1@oddfinds.com",
          items: 2,
        },
        {
          orderNumber: "ODF-104931",
          status: "PROCESSING",
          total: 699,
          payment: "AUTHORIZED",
          trackingNumber: "",
          deliveryPartner: "",
          customerEmail: "customer2@oddfinds.com",
          items: 1,
        },
        {
          orderNumber: "ODF-104930",
          status: "SHIPPED",
          total: 1459,
          payment: "CAPTURED",
          trackingNumber: "SHIP-783921",
          deliveryPartner: "Shiprocket",
          customerEmail: "customer1@oddfinds.com",
          items: 1,
        },
      ],
      deliveryPartners: [
        { partner: "Shiprocket", activeShipments: 18 },
        { partner: "Delhivery", activeShipments: 11 },
        { partner: "India Post", activeShipments: 6 },
      ],
      moderationReviews: seedReviews.slice(0, 12).map((review, index) => ({
        id: review.id,
        productId: review.productId,
        authorName: review.authorName,
        rating: review.rating,
        title: review.title,
        body: review.body,
        status: index % 3 === 0 ? "PENDING" : "APPROVED",
      })),
      settings: {
        storeName: "OddFinds",
        supportEmail: "hello@oddfinds.com",
        freeShippingThreshold: 999,
        defaultGstPercent: 18,
        defaultCurrency: "INR",
        procurementBudgetUsd: 5000,
      },
      emailAutomations: [
        {
          id: "mail-order-confirmed",
          name: "Order Confirmation",
          trigger: "Order placed",
          enabled: true,
          sentToday: 38,
          lastRunAt: new Date().toISOString(),
        },
        {
          id: "mail-order-shipped",
          name: "Shipment Update",
          trigger: "Order marked shipped",
          enabled: true,
          sentToday: 19,
          lastRunAt: new Date().toISOString(),
        },
        {
          id: "mail-review-request",
          name: "Review Request",
          trigger: "Delivered +3 days",
          enabled: true,
          sentToday: 12,
          lastRunAt: new Date().toISOString(),
        },
        {
          id: "mail-cart-abandon",
          name: "Cart Recovery",
          trigger: "Cart abandoned +2 hours",
          enabled: false,
          sentToday: 0,
          lastRunAt: null,
        },
      ],
      aiRegistry: [
        { id: "agent-review-generator", name: "Review Generator", enabled: true, mode: "active", runsToday: 7 },
        { id: "agent-product-finder", name: "Product Finder", enabled: true, mode: "active", runsToday: 5 },
        { id: "agent-negotiation-drafter", name: "Negotiation Drafter", enabled: true, mode: "active", runsToday: 4 },
        { id: "agent-description-writer", name: "Description Writer", enabled: true, mode: "active", runsToday: 6 },
        { id: "agent-cost-calculator", name: "Cost Calculator", enabled: true, mode: "active", runsToday: 3 },
        { id: "agent-smart-pricing", name: "Smart Pricing", enabled: true, mode: "active", runsToday: 2 },
        { id: "agent-customer-service", name: "Customer Service Bot", enabled: false, mode: "planned", runsToday: 0 },
        { id: "agent-inventory-optimizer", name: "Inventory Optimizer", enabled: false, mode: "planned", runsToday: 0 },
      ],
    };
  }

  return globalThis[ADMIN_KEY];
}

export function listCustomers() {
  return clone(getStore().customers);
}

export function listDiscounts() {
  return clone(getStore().discounts);
}

export function createDiscount(input) {
  const store = getStore();
  const code = String(input.code || "").trim().toUpperCase();
  if (!code) return null;
  const discount = {
    id: `disc_${Date.now()}`,
    code,
    type: String(input.type || "PERCENTAGE"),
    value: Number(input.value || 0),
    active: true,
  };
  store.discounts.unshift(discount);
  return clone(discount);
}

export function listOrders() {
  return clone(getStore().orders);
}

export function findOrder(orderNumber) {
  const order = getStore().orders.find((item) => item.orderNumber === orderNumber);
  return order ? clone(order) : null;
}

export function updateOrder(orderNumber, patch = {}) {
  const store = getStore();
  const index = store.orders.findIndex((item) => item.orderNumber === orderNumber);
  if (index === -1) return null;
  store.orders[index] = {
    ...store.orders[index],
    ...patch,
  };
  return clone(store.orders[index]);
}

export function listDeliveryPartners() {
  return clone(getStore().deliveryPartners);
}

export function assignDelivery({ orderNumber, partner, trackingNumber }) {
  const updated = updateOrder(orderNumber, {
    deliveryPartner: partner || "",
    trackingNumber: trackingNumber || "",
    status: "SHIPPED",
  });
  if (!updated) return null;

  const store = getStore();
  const target = store.deliveryPartners.find((item) => item.partner === partner);
  if (target) target.activeShipments += 1;

  return updated;
}

export function listModerationReviews() {
  return clone(getStore().moderationReviews);
}

export function updateReviewStatus(reviewId, status = "APPROVED") {
  const store = getStore();
  const index = store.moderationReviews.findIndex((review) => review.id === reviewId);
  if (index === -1) return null;
  store.moderationReviews[index] = {
    ...store.moderationReviews[index],
    status,
  };
  return clone(store.moderationReviews[index]);
}

export function getSettings() {
  return clone(getStore().settings);
}

export function updateSettings(patch = {}) {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...patch,
  };
  return clone(store.settings);
}

export function listEmailAutomations() {
  return clone(getStore().emailAutomations);
}

export function updateEmailAutomation(automationId, patch = {}) {
  const store = getStore();
  const index = store.emailAutomations.findIndex((item) => item.id === automationId);
  if (index === -1) return null;
  store.emailAutomations[index] = {
    ...store.emailAutomations[index],
    ...patch,
    lastRunAt: patch.enabled === false ? store.emailAutomations[index].lastRunAt : new Date().toISOString(),
  };
  return clone(store.emailAutomations[index]);
}

export function listAiRegistry() {
  return clone(getStore().aiRegistry);
}

export function updateAiRegistryAgent(agentId, patch = {}) {
  const store = getStore();
  const index = store.aiRegistry.findIndex((item) => item.id === agentId);
  if (index === -1) return null;
  store.aiRegistry[index] = {
    ...store.aiRegistry[index],
    ...patch,
  };
  return clone(store.aiRegistry[index]);
}
