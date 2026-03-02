import "dotenv/config";
import bcrypt from "bcryptjs";
import { getDb, mongoClient } from "./client.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const categorySeeds = [
  { id: "cat-desk-chaos", name: "Desk Chaos", slug: "desk-chaos", description: "Office upgrades with zero chill." },
  { id: "cat-kitchen-madness", name: "Kitchen Madness", slug: "kitchen-madness", description: "Cooking tools with dramatic personality." },
  { id: "cat-gift-a-wtf", name: "Gift a WTF", slug: "gift-a-wtf", description: "Ridiculous gifts people never forget." },
  { id: "cat-wearable-weirdness", name: "Wearable Weirdness", slug: "wearable-weirdness", description: "Fashion choices that demand attention." },
  { id: "cat-tech-oddities", name: "Tech Oddities", slug: "tech-oddities", description: "Gadgets from an alternate timeline." },
  { id: "cat-prank-central", name: "Prank Central", slug: "prank-central", description: "Harmless chaos for certified troublemakers." },
];

const productNamesByCategory = {
  "desk-chaos": ["Dramatic Chipmunk Desk Toy", "Meeting Escape Button", "Chaos Coordinator Sticky Notes", "Mini Panic Siren Paperweight"],
  "kitchen-madness": ["Screaming Goat Coffee Mug", "Mood Ring Water Bottle", "Noodle Slingshot Fork", "Selfie Toaster Stencil Set"],
  "gift-a-wtf": ["Emotional Support Pickle", "Yodeling Cactus Mini", "Fortune Potato Keychain", "Instant Regret Gift Box"],
  "wearable-weirdness": ["Pizza Socks Box", "Mood Swing Bucket Hat", "Alien Abduction Raincoat", "Meme Lord Slide Sandals"],
  "tech-oddities": ["USB Pet Rock", "Portable Clouds Night Light", "Bluetooth Banana Receiver", "Laser Cat Distraction Pointer"],
  "prank-central": ["Invisible Ink Prank Pen Set", "Fake Spill Keyboard Sticker", "Mystery Sneeze Sound Box", "Voice Changer Doorbell"],
};

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Jaipur", "Hyderabad", "Kolkata", "Ahmedabad", "Chennai", "Lucknow", "Indore", "Surat"];
const names = ["Aarav", "Vihaan", "Reyansh", "Ishaan", "Aditya", "Kabir", "Arjun", "Ananya", "Saanvi", "Aanya", "Diya", "Ira", "Meera", "Rohan", "Nikhil", "Priya", "Kritika", "Aniket", "Yash", "Pooja", "Rahul", "Sneha", "Tanvi", "Karan"];

function weightedRating() {
  const r = Math.random();
  if (r < 0.7) return 5;
  if (r < 0.85) return 4;
  if (r < 0.95) return 3;
  return 2;
}

async function clearCollections(db) {
  const collections = [
    "users",
    "addresses",
    "categories",
    "products",
    "reviews",
    "discounts",
    "suppliers",
    "orders",
    "email_logs",
    "shipping_zones",
    "site_config",
    "ai_action_logs",
    "admin_activity_logs",
    "referral_programs",
    "blog_posts",
  ];

  await Promise.all(collections.map((name) => db.collection(name).deleteMany({})));
}

async function seed() {
  const db = await getDb();
  const now = new Date();

  await clearCollections(db);

  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const customerPasswordHash = await bcrypt.hash("customer123", 12);

  const users = [
    {
      id: "usr-admin",
      email: "admin@oddfinds.com",
      name: "OddFinds Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-customer-1",
      email: "customer1@oddfinds.com",
      name: "Test Customer One",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+919900001111",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-customer-2",
      email: "customer2@oddfinds.com",
      name: "Test Customer Two",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+919900002222",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("users").insertMany(users);

  await db.collection("addresses").insertOne({
    id: "addr-default-1",
    userId: "usr-customer-1",
    name: "Test Customer One",
    phone: "+919900001111",
    line1: "42 Curio Lane",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560001",
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("categories").insertMany(
    categorySeeds.map((category) => ({
      ...category,
      image: `https://picsum.photos/seed/${category.slug}/1000/700`,
      seoTitle: `${category.name} | OddFinds`,
      seoDescription: category.description,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const products = [];
  let index = 1;

  for (const category of categorySeeds) {
    for (const productName of productNamesByCategory[category.slug]) {
      const price = randomInt(299, 2999);
      const compareAtPrice = Math.round(price * (1.3 + Math.random() * 0.2));
      const inventoryQuantity = randomInt(3, 120);
      const lowStockThreshold = randomInt(5, 12);

      products.push({
        id: `prod-${index}`,
        name: productName,
        slug: productName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        description: `${productName} is built for high-conversion novelty shopping with solid quality, playful design, and gift-ready presentation.`,
        shortDescription: `${productName}: premium weirdness that ships fast.`,
        price,
        compareAtPrice,
        currency: "INR",
        sku: `ODF-${String(index).padStart(5, "0")}`,
        categoryId: category.id,
        categorySlug: category.slug,
        tags: [category.slug.split("-")[0], "viral", "gift", "odd"],
        status: "ACTIVE",
        isFeatured: index <= 8,
        weight: randomInt(90, 900),
        dimensions: { length: randomInt(8, 30), width: randomInt(5, 20), height: randomInt(4, 18) },
        images: [
          `https://picsum.photos/seed/${category.slug}-${index}-1/1200/1200`,
          `https://picsum.photos/seed/${category.slug}-${index}-2/1200/1200`,
        ],
        inventory: {
          quantity: inventoryQuantity,
          lowStockThreshold,
          trackInventory: true,
          reservedQuantity: randomInt(0, 5),
        },
        fakeViewers: randomInt(5, 48),
        sold24h: randomInt(3, 36),
        avgRating: 0,
        reviewCount: 0,
        createdAt: now,
        updatedAt: now,
      });

      index += 1;
    }
  }

  await db.collection("products").insertMany(products);

  const reviews = [];

  for (const product of products) {
    const reviewCountPerProduct = 5;
    for (let i = 0; i < reviewCountPerProduct; i += 1) {
      reviews.push({
        id: `rev-${product.id}-${i + 1}`,
        productId: product.id,
        userId: Math.random() > 0.5 ? "usr-customer-1" : "usr-customer-2",
        rating: weightedRating(),
        title: randomItem(["Unexpectedly amazing", "Exactly the chaos I wanted", "Great gift value", "Quality surprised me", "Weird but useful"]),
        body: randomItem([
          "Bought this as a joke but the build quality is genuinely solid.",
          "Packaging was clean, delivery was quick, and the product is hilariously good.",
          "Perfect gift item. Everyone asked for the link.",
          "Not just meme value, this is actually functional and fun.",
          "I laughed at first, then ordered two more for friends.",
        ]),
        authorName: `${randomItem(names)} ${String.fromCharCode(65 + randomInt(0, 20))}.`,
        authorLocation: randomItem(cities),
        isVerified: Math.random() > 0.25,
        isGenerated: Math.random() > 0.8,
        isApproved: true,
        helpfulCount: randomInt(0, 55),
        images: [],
        createdAt: now,
      });
    }
  }

  await db.collection("reviews").insertMany(reviews);

  const ratingMap = new Map();
  for (const review of reviews) {
    if (!ratingMap.has(review.productId)) ratingMap.set(review.productId, []);
    ratingMap.get(review.productId).push(review.rating);
  }

  for (const product of products) {
    const list = ratingMap.get(product.id) || [];
    const avgRating = list.length ? Number((list.reduce((a, b) => a + b, 0) / list.length).toFixed(1)) : 0;
    await db.collection("products").updateOne(
      { id: product.id },
      { $set: { avgRating, reviewCount: list.length, updatedAt: new Date() } },
    );
  }

  const future = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90);
  await db.collection("discounts").insertMany([
    { id: "disc-oddweek", code: "ODDWEEK", type: "PERCENTAGE", value: 15, minOrderAmount: 999, isActive: true, startsAt: now, expiresAt: future, createdAt: now },
    { id: "disc-firstbuy", code: "FIRSTBUY", type: "FIXED_AMOUNT", value: 200, minOrderAmount: 799, isActive: true, startsAt: now, expiresAt: future, createdAt: now },
    { id: "disc-freeship", code: "FREESHIP", type: "FREE_SHIPPING", value: 0, minOrderAmount: 499, isActive: true, startsAt: now, expiresAt: future, createdAt: now },
  ]);

  await db.collection("suppliers").insertMany([
    { id: "sup-1", name: "Mumbai Oddities Pvt Ltd", platform: "IndiaMART", location: "Mumbai", country: "India", rating: 4, createdAt: now },
    { id: "sup-2", name: "Chaos Labs Export", platform: "Alibaba", location: "Shenzhen", country: "China", rating: 5, createdAt: now },
    { id: "sup-3", name: "QuirkKart Source", platform: "Local", location: "Bengaluru", country: "India", rating: 3, createdAt: now },
  ]);

  await db.collection("shipping_zones").insertMany([
    { id: "zone-india", name: "India", countries: ["India"], baseRate: 79, etaDays: "2-5", carriers: ["India Post", "Delhivery", "Shiprocket"] },
    { id: "zone-south-asia", name: "South Asia", countries: ["Nepal", "Sri Lanka", "Bangladesh"], baseRate: 399, etaDays: "5-8", carriers: ["DHL"] },
    { id: "zone-sea", name: "Southeast Asia", countries: ["Thailand", "Vietnam", "Singapore"], baseRate: 549, etaDays: "6-10", carriers: ["DHL", "FedEx"] },
    { id: "zone-me", name: "Middle East", countries: ["UAE", "Saudi Arabia", "Qatar"], baseRate: 699, etaDays: "7-12", carriers: ["DHL", "FedEx"] },
    { id: "zone-europe", name: "Europe", countries: ["Germany", "France", "Italy"], baseRate: 899, etaDays: "8-14", carriers: ["DHL", "FedEx"] },
    { id: "zone-na", name: "North America", countries: ["United States", "Canada"], baseRate: 999, etaDays: "8-14", carriers: ["DHL", "FedEx"] },
  ]);

  const orderNumber = `ODF-${randomInt(100000, 999999)}`;
  await db.collection("orders").insertOne({
    id: "ord-1",
    orderNumber,
    userId: "usr-customer-1",
    status: "PROCESSING",
    subtotal: 2098,
    shippingCost: 79,
    tax: 378,
    total: 2555,
    currency: "INR",
    paymentMethod: "RAZORPAY",
    paymentStatus: "CAPTURED",
    items: [
      { productId: "prod-1", quantity: 1, price: 799, total: 799 },
      { productId: "prod-2", quantity: 1, price: 1299, total: 1299 },
    ],
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("email_logs").insertOne({
    id: "mail-1",
    orderId: "ord-1",
    to: "customer1@oddfinds.com",
    subject: `Order Confirmation ${orderNumber}`,
    template: "order-confirmation",
    status: "sent",
    sentAt: now,
  });

  await db.collection("site_config").insertMany([
    { key: "storeName", value: "OddFinds", createdAt: now },
    { key: "freeShippingThresholdINR", value: 999, createdAt: now },
  ]);

  await db.collection("ai_action_logs").insertOne({
    type: "describe",
    prompt: "Generate launch copy for Screaming Goat Coffee Mug",
    response: "Fun SEO-friendly description generated successfully.",
    isMocked: true,
    createdAt: now,
  });

  await db.collection("admin_activity_logs").insertOne({
    adminEmail: "admin@oddfinds.com",
    action: "SEED_INIT",
    entity: "SYSTEM",
    description: "Initial MongoDB seed completed.",
    createdAt: now,
  });

  await db.collection("blog_posts").insertMany([
    {
      slug: "weird-products-that-sell",
      title: "7 Weird Products That Keep Selling Out",
      excerpt: "A practical look at novelty product conversion behavior.",
      content: "# Weird products that sell\n\nCustomers buy novelty when quality and trust are clear.",
      isPublished: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "gift-guide-chaotic-friends",
      title: "Gift Guide for Your Most Chaotic Friend",
      excerpt: "A shortlist of unforgettable odd gifts.",
      content: "# Gift guide\n\nProducts that maximize surprise while staying useful.",
      isPublished: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log("MongoDB seed completed.");
  console.log(`Categories: ${categorySeeds.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Reviews: ${reviews.length}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
