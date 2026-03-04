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

function slugifyValue(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeMediaUrls(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const normalized = list
    .map((item) => String(item || "").trim())
    .filter((item) => item.startsWith("http://") || item.startsWith("https://"));
  return Array.from(new Set(normalized));
}

function normalizeTags(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return Array.from(
    new Set(
      list
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function parseHomePlacement(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "trending") return { isFeatured: true, isNew: false };
  if (normalized === "new-arrivals") return { isFeatured: false, isNew: true };
  if (normalized === "trending-new-arrivals") return { isFeatured: true, isNew: true };
  return { isFeatured: false, isNew: false };
}

function formatHomePlacement(isFeatured, isNew) {
  if (isFeatured && isNew) return "trending-new-arrivals";
  if (isFeatured) return "trending";
  if (isNew) return "new-arrivals";
  return "none";
}

function normalizeProductRecord(product) {
  const images = normalizeMediaUrls(product.images || product.image || []);
  const videos = normalizeMediaUrls(product.videos || []);
  const category = String(product.category || product.categorySlug || "tech-oddities");
  const isFeatured = Boolean(product.isFeatured);
  const isNew = Boolean(product.isNew);
  const tags = normalizeTags(product.tags);

  return {
    ...product,
    category,
    categorySlug: category,
    tags,
    images,
    videos,
    image: images[0] || "",
    rating: Math.min(5, Math.max(0, Number(product.rating || 4.5))),
    reviewCount: Math.max(0, Math.round(Number(product.reviewCount || 0))),
    fakeViewers: Math.max(0, Math.round(Number(product.fakeViewers || 12))),
    sold24h: Math.max(0, Math.round(Number(product.sold24h || 0))),
    weight: Math.max(0, Number(product.weight || 250)),
    dimensions: product.dimensions || { length: 10, width: 10, height: 10 },
    isFeatured,
    isNew,
    homePlacement: formatHomePlacement(isFeatured, isNew),
    inventory: toInventoryQuantity(product),
    lowStockThreshold: toLowStockThreshold(product),
  };
}

async function readProductsFromDb() {
  try {
    const records = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    if (Array.isArray(records)) {
      return records.map((item) => normalizeProductRecord(item));
    }
  } catch (error) {
    console.error(`Product read failed: ${error?.message || "unknown error"}`);
  }
  return [...products].map((item) => normalizeProductRecord(item));
}

async function readProductByIdFromDb(productId) {
  try {
    const record = await prisma.product.findFirst({ where: { id: productId } });
    if (record) return normalizeProductRecord(record);
  } catch (error) {
    console.error(`Product read by id failed: ${error?.message || "unknown error"}`);
  }
  const fallback = products.find((item) => item.id === productId);
  return fallback ? normalizeProductRecord(fallback) : null;
}

function buildProductPayload(input = {}, existing = null) {
  const now = new Date();
  const fallbackName = existing?.name || "Untitled Product";
  const name = String(input.name ?? fallbackName).trim() || fallbackName;
  const category = String(input.category ?? existing?.category ?? existing?.categorySlug ?? "tech-oddities").trim() || "tech-oddities";
  const inventory = Math.max(0, Math.round(Number(input.inventory ?? toInventoryQuantity(existing || {})) || 0));
  const lowStockThreshold = Math.max(0, Math.round(Number(input.lowStockThreshold ?? toLowStockThreshold(existing || {})) || 0));
  const imageList = normalizeMediaUrls(
    Array.isArray(input.images) ? input.images : input.image ? [input.image] : existing?.images || [],
  );
  const videoList = normalizeMediaUrls(Array.isArray(input.videos) ? input.videos : existing?.videos || []);
  const tags = normalizeTags(input.tags ?? existing?.tags ?? []);
  const price = Math.max(0, Number(input.price ?? existing?.price ?? 0));
  const compareAtPrice = Math.max(price, Number(input.compareAtPrice ?? existing?.compareAtPrice ?? price));
  const placementFlags = parseHomePlacement(input.homePlacement ?? existing?.homePlacement);
  const isFeatured = Boolean(input.isFeatured ?? placementFlags.isFeatured ?? existing?.isFeatured ?? false);
  const isNew = Boolean(input.isNew ?? placementFlags.isNew ?? existing?.isNew ?? false);

  return {
    ...(existing || {}),
    id: existing?.id || String(input.id || `prod-${Date.now()}`),
    name,
    slug: String(input.slug ?? existing?.slug ?? slugifyValue(name)).trim() || slugifyValue(name),
    shortDescription:
      String(input.shortDescription ?? existing?.shortDescription ?? "").trim() || `${name} from OddFinds.`,
    description:
      String(input.description ?? existing?.description ?? "").trim() || `${name} from OddFinds.`,
    price,
    compareAtPrice,
    sku: String(input.sku ?? existing?.sku ?? `ODF-${Date.now()}`).trim() || `ODF-${Date.now()}`,
    category,
    categorySlug: category,
    tags,
    images: imageList,
    videos: videoList,
    inventory,
    lowStockThreshold,
    rating: Math.min(5, Math.max(0, Number(input.rating ?? existing?.rating ?? 4.5))),
    reviewCount: Math.max(0, Math.round(Number(input.reviewCount ?? existing?.reviewCount ?? 0))),
    fakeViewers: Math.max(0, Math.round(Number(input.fakeViewers ?? existing?.fakeViewers ?? 12))),
    sold24h: Math.max(0, Math.round(Number(input.sold24h ?? existing?.sold24h ?? 0))),
    weight: Math.max(0, Number(input.weight ?? existing?.weight ?? 250)),
    dimensions: input.dimensions ?? existing?.dimensions ?? { length: 10, width: 10, height: 10 },
    isFeatured,
    isNew,
    homePlacement: formatHomePlacement(isFeatured, isNew),
    updatedAt: now,
    createdAt: existing?.createdAt || now,
  };
}

app.get("/api/health", (req, res) => {
  ok(res, { success: true, service: "backend", port });
});

app.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    const category = String(req.query.category || "").trim();
    const query = String(req.query.query || "").trim().toLowerCase();

    let list = await readProductsFromDb();
    if (category) list = list.filter((product) => product.category === category);
    if (query) {
      list = list.filter((product) => product.name.toLowerCase().includes(query));
    }

    ok(res, { data: list });
  }),
);

app.post(
  "/api/products",
  asyncHandler(async (req, res) => {
    const payload = buildProductPayload(req.body || {});
    const created = await prisma.product.create({ data: payload });
    ok(res, { success: true, data: normalizeProductRecord(created) }, 201);
  }),
);

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

app.get(
  "/api/admin/inventory",
  asyncHandler(async (req, res) => {
    const list = await readProductsFromDb();
    ok(res, {
      data: list.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: toInventoryQuantity(product),
        lowStockThreshold: toLowStockThreshold(product),
      })),
    });
  }),
);

app.patch(
  "/api/admin/inventory",
  asyncHandler(async (req, res) => {
    const productId = String(req.body?.id || "").trim();
    if (!productId) return ok(res, { message: "id is required." }, 400);

    const existing = await readProductByIdFromDb(productId);
    if (!existing) return ok(res, { message: "Product not found." }, 404);

    const payload = buildProductPayload(
      {
        inventory: req.body?.quantity,
        lowStockThreshold: req.body?.lowStockThreshold ?? existing.lowStockThreshold,
      },
      existing,
    );
    const updated = await prisma.product.update({
      where: { id: productId },
      data: payload,
    });
    if (!updated) return ok(res, { message: "Product not found." }, 404);

    ok(res, {
      success: true,
      data: {
        id: updated.id,
        quantity: toInventoryQuantity(updated),
        lowStockThreshold: toLowStockThreshold(updated),
      },
    });
  }),
);

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

app.get(
  "/api/admin/products",
  asyncHandler(async (req, res) => {
    const productId = String(req.query.id || "").trim();
    const list = await readProductsFromDb();

    if (productId) {
      const product = list.find((item) => item.id === productId) || (await readProductByIdFromDb(productId));
      return ok(res, { data: product });
    }

    const header = "id,name,slug,price,inventory";
    const rows = list.map((product) =>
      [product.id, product.name, product.slug, product.price, toInventoryQuantity(product)].join(","),
    );
    const csv = [header, ...rows].join("\n");

    if (req.query.format === "csv") {
      writeCsvHeaders(res, "products.csv");
      return res.status(200).send(csv);
    }

    ok(res, { data: list, exportCsv: csv });
  }),
);

app.post(
  "/api/admin/products",
  asyncHandler(async (req, res) => {
    const payload = buildProductPayload(req.body || {});
    const created = await prisma.product.create({ data: payload });
    ok(res, { success: true, data: normalizeProductRecord(created) }, 201);
  }),
);

app.put(
  "/api/admin/products",
  asyncHandler(async (req, res) => {
    const input = req.body || {};
    const productId = String(input.id || "").trim();
    if (!productId) return ok(res, { message: "id is required." }, 400);

    const existing = await readProductByIdFromDb(productId);
    if (!existing) return ok(res, { message: "Product not found." }, 404);

    const payload = buildProductPayload(input, existing);
    const updated = await prisma.product.update({ where: { id: productId }, data: payload });
    if (!updated) return ok(res, { message: "Product not found." }, 404);

    ok(res, { success: true, data: normalizeProductRecord(updated) });
  }),
);

app.patch(
  "/api/admin/products",
  asyncHandler(async (req, res) => {
    const input = { ...(req.body || {}), id: req.body?.id || req.query?.id };
    const productId = String(input.id || "").trim();
    if (!productId) return ok(res, { message: "id is required." }, 400);

    const existing = await readProductByIdFromDb(productId);
    if (!existing) return ok(res, { message: "Product not found." }, 404);

    const payload = buildProductPayload(input, existing);
    const updated = await prisma.product.update({ where: { id: productId }, data: payload });
    if (!updated) return ok(res, { message: "Product not found." }, 404);

    ok(res, { success: true, data: normalizeProductRecord(updated) });
  }),
);

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
