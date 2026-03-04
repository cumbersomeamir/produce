import dotenv from "dotenv";
import express from "express";
import { executeAgent } from "./controllers/aiController.js";
import { sendTransactional } from "./controllers/emailController.js";
import { createRazorpay, createStripe } from "./controllers/paymentController.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./prisma/client.js";
import { products, reviews, shippingZones } from "./data/mock-data.js";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
dotenv.config();

const app = express();
const port = Number(process.env.BACKEND_PORT || process.env.PORT || 4000);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const cartState = { items: [] };
const publicOrders = [
  { orderNumber: "ODF-104932", status: "PENDING", total: 2199 },
  { orderNumber: "ODF-104931", status: "SHIPPED", total: 999 },
];
const adminOrders = [{ orderNumber: "ODF-104932", status: "PENDING", total: 2199 }];
const customers = [
  { id: "usr_1", email: "customer1@oddfinds.com", name: "Test Customer One" },
  { id: "usr_2", email: "customer2@oddfinds.com", name: "Test Customer Two" },
];

const CARRIER_MATRIX = {
  India: ["India Post", "Delhivery", "Shiprocket"],
  "South Asia": ["India Post", "DHL"],
  "Southeast Asia": ["DHL", "FedEx"],
  "Middle East": ["DHL", "FedEx"],
  Europe: ["DHL", "FedEx"],
  "North America": ["DHL", "FedEx"],
  "Rest of World": ["DHL"],
};

const AI_TYPES = [
  "inventory-optimizer",
  "generate-reviews",
  "cost-calculator",
  "describe",
  "ad-copy",
  "customer-service",
  "supplier-discovery",
  "product-finder",
  "negotiate",
  "seo-content",
];

function ok(res, payload, status = 200) {
  return res.status(status).json(payload);
}

function asyncHandler(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function withRateLimit(keyPrefix, limit) {
  return rateLimiter({ keyPrefix, limit, windowMs: 60_000 });
}

function toInventoryQuantity(product) {
  if (typeof product.inventory === "number") return product.inventory;
  if (product.inventory && typeof product.inventory.quantity === "number") return product.inventory.quantity;
  return 0;
}

function toLowStockThreshold(product) {
  if (typeof product.lowStockThreshold === "number") return product.lowStockThreshold;
  if (product.inventory && typeof product.inventory.lowStockThreshold === "number") {
    return product.inventory.lowStockThreshold;
  }
  return 5;
}

function calculateShippingRate({ country = "India", weight = 500, subtotal = 0 }) {
  const normalizedWeight = Math.max(100, Number(weight));
  const domestic = String(country).toLowerCase() === "india";
  const zone =
    shippingZones.find((item) => (domestic ? item.zone === "India" : item.zone !== "India")) || shippingZones[0];

  if (domestic && Number(subtotal) >= 999) {
    return {
      zone: zone.zone,
      carrier: "Delhivery",
      rate: 0,
      etaDays: zone.days,
      free: true,
    };
  }

  const extraWeightUnits = Math.max(0, Math.ceil((normalizedWeight - 500) / 500));
  const rate = zone.baseRate + extraWeightUnits * (domestic ? 25 : 120);

  return {
    zone: zone.zone,
    carrier: (CARRIER_MATRIX[zone.zone] || ["India Post"])[0],
    rate,
    etaDays: zone.days,
    free: false,
  };
}

function buildOrderNumber() {
  return `ODF-${Math.floor(100000 + Math.random() * 900000)}`;
}

function writeCsvHeaders(res, fileName) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
}

app.get("/api/health", (req, res) => {
  ok(res, { success: true, service: "backend", port });
});

app.get("/api/products", (req, res) => {
  const category = req.query.category;
  const query = req.query.query;

  let list = [...products];
  if (category) list = list.filter((product) => product.category === category);
  if (query) {
    const q = String(query).toLowerCase();
    list = list.filter((product) => product.name.toLowerCase().includes(q));
  }

  ok(res, { data: list });
});

app.post("/api/products", (req, res) => {
  ok(res, { success: true, data: { id: `prod_${Date.now()}`, ...req.body } }, 201);
});

app.get("/api/cart", (req, res) => {
  ok(res, { data: cartState.items });
});

app.post("/api/cart", withRateLimit("cart", 120), (req, res) => {
  cartState.items = req.body.items || [];
  ok(res, { success: true, data: cartState.items });
});

app.post(
  "/api/checkout",
  withRateLimit("checkout", 15),
  asyncHandler(async (req, res) => {
    const orderNumber = buildOrderNumber();
    await sendTransactional({
      to: req.body.email || "customer@oddfinds.com",
      subject: `Order Confirmation ${orderNumber}`,
      html: `<p>Your order <strong>${orderNumber}</strong> is confirmed.</p>`,
      template: "order-confirmation",
    });

    ok(res, {
      success: true,
      orderNumber,
      paymentMethod: req.body.paymentMethod,
      status: "PENDING",
    });
  }),
);

app.get("/api/orders", (req, res) => {
  ok(res, { data: publicOrders });
});

app.post("/api/orders", (req, res) => {
  const orderNumber = buildOrderNumber();
  const order = {
    orderNumber,
    status: "PENDING",
    ...req.body,
  };
  publicOrders.unshift(order);

  ok(
    res,
    {
      success: true,
      data: order,
      invoice: {
        fileName: `${orderNumber}.pdf`,
        url: `/invoices/${orderNumber}.pdf`,
      },
    },
    201,
  );
});

app.get("/api/reviews", (req, res) => {
  const productId = req.query.productId;
  const data = productId ? reviews.filter((review) => review.productId === productId) : reviews;
  ok(res, { data });
});

app.post("/api/reviews", (req, res) => {
  ok(
    res,
    {
      success: true,
      data: {
        id: `rev_${Date.now()}`,
        ...req.body,
      },
    },
    201,
  );
});

app.post(
  "/api/auth/register",
  withRateLimit("auth-register", 12),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return ok(res, { message: "Missing required fields" }, 400);
    }

    ok(res, {
      success: true,
      user: {
        id: `usr_${Date.now()}`,
        name,
        email,
      },
    });
  }),
);

app.post(
  "/api/email",
  withRateLimit("email", 30),
  asyncHandler(async (req, res) => {
    const result = await sendTransactional(req.body);
    ok(res, { success: true, data: result });
  }),
);

app.post("/api/shipping", (req, res) => {
  ok(res, { data: calculateShippingRate(req.body || {}) });
});

app.post(
  "/api/payments/razorpay",
  withRateLimit("payment-rzp", 30),
  asyncHandler(async (req, res) => {
    const order = await createRazorpay({
      amount: req.body.amount,
      currency: req.body.currency || "INR",
      receipt: req.body.receipt || `receipt_${Date.now()}`,
    });
    ok(res, { success: true, data: order });
  }),
);

app.post(
  "/api/payments/stripe",
  withRateLimit("payment-stripe", 30),
  asyncHandler(async (req, res) => {
    const intent = await createStripe({
      amount: req.body.amount,
      currency: req.body.currency || "usd",
      metadata: req.body.metadata || {},
    });
    ok(res, { success: true, data: intent });
  }),
);

app.post("/api/webhooks/payment", (req, res) => {
  ok(res, {
    received: true,
    source: "payment",
    event: req.body.event || req.body.type || "unknown",
  });
});

app.post("/api/webhooks/delivery", (req, res) => {
  ok(res, {
    received: true,
    source: "delivery",
    status: req.body.status || "unknown",
  });
});

for (const type of AI_TYPES) {
  app.post(
    `/api/ai/${type}`,
    withRateLimit(`ai-${type}`, 20),
    asyncHandler(async (req, res) => {
      const result = await executeAgent(type, req.body || {});
      ok(res, { success: true, data: result });
    }),
  );
}

app.get("/api/admin/reviews", (req, res) => {
  ok(res, { data: [] });
});

app.post("/api/admin/reviews", (req, res) => {
  ok(res, { success: true, action: req.body.action || "approve" });
});

app.get("/api/admin/procurement", (req, res) => {
  ok(res, {
    data: {
      suppliers: 3,
      activeNegotiations: 2,
      avgLandedMargin: "41%",
    },
  });
});

app.get("/api/admin/inventory", (req, res) => {
  ok(
    res,
    {
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: toInventoryQuantity(product),
        lowStockThreshold: toLowStockThreshold(product),
      })),
    },
  );
});

app.patch("/api/admin/inventory", (req, res) => {
  ok(res, { success: true, updated: req.body });
});

app.get("/api/admin/orders", (req, res) => {
  if (req.query.format === "csv") {
    const header = "orderNumber,status,total";
    const rows = adminOrders.map((order) => `${order.orderNumber},${order.status},${order.total}`);
    writeCsvHeaders(res, "orders.csv");
    return res.status(200).send([header, ...rows].join("\n"));
  }

  ok(res, { data: adminOrders });
});

app.patch("/api/admin/orders", (req, res) => {
  ok(res, { success: true, data: req.body });
});

app.get("/api/admin/discounts", (req, res) => {
  ok(res, {
    data: [
      { code: "ODDWEEK", type: "PERCENTAGE", value: 15 },
      { code: "FIRSTBUY", type: "FIXED_AMOUNT", value: 200 },
      { code: "FREESHIP", type: "FREE_SHIPPING", value: 0 },
    ],
  });
});

app.post("/api/admin/discounts", (req, res) => {
  ok(res, { success: true, discount: req.body }, 201);
});

app.get("/api/admin/products", (req, res) => {
  const header = "id,name,slug,price,inventory";
  const rows = products.map((product) =>
    [product.id, product.name, product.slug, product.price, toInventoryQuantity(product)].join(","),
  );
  const csv = [header, ...rows].join("\n");

  if (req.query.format === "csv") {
    writeCsvHeaders(res, "products.csv");
    return res.status(200).send(csv);
  }

  ok(res, { data: products, exportCsv: csv });
});

app.post("/api/admin/products", (req, res) => {
  ok(res, { success: true, data: { id: `prod_${Date.now()}`, ...req.body } }, 201);
});

app.get("/api/admin/delivery", (req, res) => {
  ok(res, {
    data: [
      { partner: "Shiprocket", activeShipments: 18 },
      { partner: "Delhivery", activeShipments: 11 },
    ],
  });
});

app.post("/api/admin/delivery", (req, res) => {
  ok(res, { success: true, assignment: req.body });
});

app.get(
  "/api/admin/ai",
  asyncHandler(async (req, res) => {
    let data = [];
    try {
      data = await prisma.aiActionLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    } catch (error) {
      console.error(`Admin AI log read failed: ${error?.message || "unknown error"}`);
    }
    ok(res, { data });
  }),
);

app.get("/api/admin/customers", (req, res) => {
  if (req.query.format === "csv") {
    const header = "id,email,name";
    const rows = customers.map((customer) => `${customer.id},${customer.email},${customer.name}`);
    writeCsvHeaders(res, "customers.csv");
    return res.status(200).send([header, ...rows].join("\n"));
  }

  ok(res, { data: customers });
});

app.all("/api/*", (req, res) => {
  ok(res, { message: "Not found" }, 404);
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`OddFinds backend running on http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
