import { MeiliSearch } from "meilisearch";

const client = process.env.MEILISEARCH_HOST
  ? new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
    })
  : null;

export async function indexProducts(products) {
  if (!client) return { indexed: 0, mocked: true };
  const index = client.index("products");
  await index.addDocuments(products);
  return { indexed: products.length };
}

export async function searchProducts(query) {
  if (!client) return { hits: [], mocked: true };
  const index = client.index("products");
  return index.search(query);
}
