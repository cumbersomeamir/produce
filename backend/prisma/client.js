import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "oddfinds";
const mongoUriPattern = /^mongodb(\+srv)?:\/\//i;
const mongoEnabled = Boolean(uri && mongoUriPattern.test(uri) && !String(uri).includes("your_mongodb_uri_here"));

if (!mongoEnabled) {
  console.warn(
    "MongoDB disabled: set a valid MONGODB_URI (mongodb:// or mongodb+srv://) in .env to enable persistence.",
  );
}

const globalForMongo = globalThis;

function createClient() {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 2500),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 2500),
    socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 5000),
  });
}

const client = mongoEnabled
  ? globalForMongo.__oddfindsMongoClient || createClient()
  : null;
if (mongoEnabled && process.env.NODE_ENV !== "production") {
  globalForMongo.__oddfindsMongoClient = client;
}

let dbPromise;

async function getDb() {
  if (!mongoEnabled || !client) {
    throw new Error("MongoDB is disabled. Configure MONGODB_URI to use database-backed APIs.");
  }

  if (!dbPromise) {
    dbPromise = client.connect().then((connectedClient) => connectedClient.db(dbName));
  }
  return dbPromise;
}

function toObjectId(value) {
  if (value instanceof ObjectId) return value;
  if (typeof value === "string" && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }
  return value;
}

function sanitizeWhere(where = {}) {
  if (!where || Object.keys(where).length === 0) return {};

  const query = {};

  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(value)) {
      query.$or = value.map((item) => sanitizeWhere(item));
      continue;
    }

    if (key === "id") {
      query.id = value;
      continue;
    }

    query[key] = value;
  }

  return query;
}

function normalizeDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    id: _id?.toString?.() || _id,
    ...rest,
  };
}

function normalizeMany(docs = []) {
  return docs.map((doc) => normalizeDoc(doc));
}

function hydrateCreateData(data = {}) {
  const next = { ...data };

  if (next.images?.create) next.images = next.images.create;
  if (next.inventory?.create) next.inventory = next.inventory.create;
  if (next.items?.create) next.items = next.items.create;

  delete next._id;

  const now = new Date();
  if (!next.createdAt) next.createdAt = now;
  next.updatedAt = now;

  return next;
}

function hydrateUpdateData(data = {}) {
  const next = { ...data };

  if (next.items?.create) {
    next.items = next.items.create;
  }

  if (next.items?.deleteMany !== undefined && data.items?.create) {
    next.items = data.items.create;
  }

  next.updatedAt = new Date();
  return next;
}

function sortEntries(orderBy) {
  if (!orderBy) return undefined;
  const [key, direction] = Object.entries(orderBy)[0] || [];
  if (!key) return undefined;
  return { [key]: direction === "desc" ? -1 : 1 };
}

const COLLECTIONS = {
  product: "products",
  discount: "discounts",
  supplier: "suppliers",
  inventory: "inventories",
  review: "reviews",
  user: "users",
  cart: "carts",
  emailLog: "email_logs",
  order: "orders",
  aiActionLog: "ai_action_logs",
};

function createCollectionApi(entity) {
  const collectionName = COLLECTIONS[entity];

  return {
    async findMany(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);

      const query = sanitizeWhere(options.where);
      let cursor = collection.find(query);

      const sort = sortEntries(options.orderBy);
      if (sort) cursor = cursor.sort(sort);
      if (options.take) cursor = cursor.limit(options.take);

      let docs = normalizeMany(await cursor.toArray());

      if (entity === "inventory" && options.include?.product) {
        const products = db.collection(COLLECTIONS.product);
        docs = await Promise.all(
          docs.map(async (item) => {
            const product = await products.findOne({ id: item.productId });
            return { ...item, product: normalizeDoc(product) };
          }),
        );
      }

      if (entity === "supplier" && (options.include?.communications || options.include?.products)) {
        const messages = db.collection("supplier_messages");
        const procurement = db.collection("procurement_info");
        docs = await Promise.all(
          docs.map(async (supplier) => ({
            ...supplier,
            communications: options.include.communications
              ? normalizeMany(await messages.find({ supplierId: supplier.id }).toArray())
              : undefined,
            products: options.include.products
              ? normalizeMany(await procurement.find({ supplierId: supplier.id }).toArray())
              : undefined,
          })),
        );
      }

      return docs;
    },

    async findUnique(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const query = sanitizeWhere(options.where);
      const doc = await collection.findOne(query);
      let normalized = normalizeDoc(doc);

      if (!normalized) return null;

      if (entity === "supplier" && (options.include?.communications || options.include?.products)) {
        const messages = db.collection("supplier_messages");
        const procurement = db.collection("procurement_info");
        normalized = {
          ...normalized,
          communications: options.include.communications
            ? normalizeMany(await messages.find({ supplierId: normalized.id }).toArray())
            : undefined,
          products: options.include.products
            ? normalizeMany(await procurement.find({ supplierId: normalized.id }).toArray())
            : undefined,
        };
      }

      return normalized;
    },

    async findFirst(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const query = sanitizeWhere(options.where);
      const doc = await collection.findOne(query);
      return normalizeDoc(doc);
    },

    async create(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const data = hydrateCreateData(options.data || {});
      const result = await collection.insertOne(data);
      const doc = await collection.findOne({ _id: result.insertedId });
      return normalizeDoc(doc);
    },

    async createMany(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const rows = (options.data || []).map((item) => hydrateCreateData(item));
      if (!rows.length) return { count: 0 };
      const result = await collection.insertMany(rows, { ordered: false });
      return { count: result.insertedCount };
    },

    async update(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const query = sanitizeWhere(options.where);
      const update = { $set: hydrateUpdateData(options.data || {}) };
      const result = await collection.findOneAndUpdate(query, update, { returnDocument: "after" });
      return normalizeDoc(result?.value || result);
    },

    async deleteMany(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const query = sanitizeWhere(options.where);
      const result = await collection.deleteMany(query);
      return { count: result.deletedCount };
    },

    async count(options = {}) {
      const db = await getDb();
      const collection = db.collection(collectionName);
      const query = sanitizeWhere(options.where);
      return collection.countDocuments(query);
    },
  };
}

export const prisma = {
  product: createCollectionApi("product"),
  discount: createCollectionApi("discount"),
  supplier: createCollectionApi("supplier"),
  inventory: createCollectionApi("inventory"),
  review: createCollectionApi("review"),
  user: createCollectionApi("user"),
  cart: createCollectionApi("cart"),
  emailLog: createCollectionApi("emailLog"),
  order: createCollectionApi("order"),
  aiActionLog: createCollectionApi("aiActionLog"),

  async $disconnect() {
    if (client) {
      await client.close();
    }
  },
};

export { getDb, client as mongoClient };
