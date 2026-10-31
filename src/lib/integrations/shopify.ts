import type { Product } from "@/lib/catalog";

export interface ShopifyConfig {
  storeDomain: string;
  storefrontToken: string;
  adminToken?: string;
  webhookSecret?: string;
}

export interface ShopifyCartLine {
  productId: string;
  quantity: number;
}

export const shopifyEnabled = (config?: ShopifyConfig): boolean =>
  Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  ) || Boolean(config?.storeDomain && config?.storefrontToken);

async function storefront(
  config: ShopifyConfig,
  query: string,
  variables?: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
  const res = await fetch(
    `https://${config.storeDomain}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": config.storefrontToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  if (!res.ok) return null;
  return (await res.json()) as Record<string, unknown>;
}

export async function fetchProducts(
  config: ShopifyConfig
): Promise<Product[] | null> {
  try {
    const data = await storefront(
      config,
      `{
        products(first: 50) {
          nodes {
            id
            title
            description
            handle
            featuredImage { url }
            tags
            priceRange { minVariantPrice { amount } }
            compareAtPriceRange { minVariantPrice { amount } }
          }
        }
      }`
    );
    if (!data) return null;
    return mapShopifyData(data);
  } catch {
    return null;
  }
}

export function mapShopifyData(data: Record<string, unknown>): Product[] {
  const nodes =
    (data.data as { products: { nodes: unknown[] } } | undefined)?.products
      ?.nodes ?? [];
  return nodes.map((node) => {
    const n = node as {
      id: string;
      title: string;
      description: string;
      handle: string;
      tags: string[];
      image?: { url: string } | null;
      priceRange: { minVariantPrice: { amount: string } };
      compareAtPriceRange: { minVariantPrice: { amount: string } } | null;
    };
    return {
      id: n.id,
      slug: n.handle,
      title: n.title,
      description: n.description,
      image: n.image?.url ?? "",
      sourceUrl: `https://belghamdicoaching.com/products/${n.handle}`,
      price: Number(n.priceRange.minVariantPrice.amount),
      compareAtPrice: n.compareAtPriceRange
        ? Number(n.compareAtPriceRange.minVariantPrice.amount)
        : undefined,
      category: "Training Splits",
      frequency: "",
      audience: "",
      benefits: [],
      included: [],
      level: "intermediate",
      tags: n.tags,
      equipment: "gym",
      daysPerWeek: 0,
    } satisfies Product;
  });
}

export async function getProductsAdapter(): Promise<Product[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (domain && token) {
    const live = await fetchProducts({ storeDomain: domain, storefrontToken: token });
    if (live) return live;
  }
  return [];
}
