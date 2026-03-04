import { ApiBrand, ApiCategory, ApiProduct, ApiVariant } from "./types";
import { Product } from "@/types/product";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : 0;
};

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const isRecent = (dateStr?: string | null, days = 30) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const now = Date.now();
  const diffDays = (now - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

const pickDefaultVariant = (variants: ApiVariant[] = []) => {
  return variants.find((v) => v.status !== "inactive") || variants[0];
};

export function mapProduct(
  product: ApiProduct,
  categories: ApiCategory[] = [],
  brands: ApiBrand[] = []
): Product {
  const category = categories.find((c) => c.id === product.category_id);
  const brand = brands.find((b) => b.id === product.brand_id);
  const variant = pickDefaultVariant(product.variants || []);
  const price = toNumber(variant?.selling_price);
  const originalPrice = variant?.mrp ? toNumber(variant.mrp) : undefined;
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;
  const inStock = (toNumber(variant?.quantity) || toNumber(product.quantity)) > 0 && product.status !== "inactive";
  const description = toText(product.description);
  const shortDescription = description ? (description.length > 90 ? `${description.slice(0, 87)}...` : description) : "";
  const specs: Record<string, string> = {};
  if (product.material_composition) specs["Material"] = product.material_composition;
  if (product.care_instructions) specs["Care"] = product.care_instructions;
  if (product.season) specs["Season"] = product.season;
  if (product.hs_code) specs["HS Code"] = product.hs_code;
  if (product.sku_prefix) specs["SKU Prefix"] = product.sku_prefix;
  if (variant?.sku) specs["SKU"] = variant.sku;
  if (variant?.size_name) specs["Size"] = variant.size_name;
  if (variant?.color?.name) specs["Color"] = variant.color.name;

  const highlights = Array.isArray(product.highlights) ? product.highlights : [];
  const highlightText = highlights.join(" ").toLowerCase();
  const isFeatured = highlights.some((h) => h.toLowerCase().includes("featured"));
  const isTrending = highlights.some((h) => h.toLowerCase().includes("trending"));

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description,
    shortDescription,
    price,
    originalPrice,
    discount,
    category: category?.slug || "uncategorized",
    categoryId: String(product.category_id),
    brand: brand?.name || "",
    brandId: String(product.brand_id),
    images: product.images && product.images.length ? product.images : [PLACEHOLDER_IMAGE],
    rating: undefined,
    reviewCount: undefined,
    inStock,
    specs,
    tags: highlights,
    isFeatured: isFeatured || highlightText.includes("featured"),
    isTrending: isTrending || highlightText.includes("trending"),
    isNewArrival: isRecent(product.created_at),
    createdAt: product.created_at || product.updated_at || new Date().toISOString(),
    defaultVariantId: variant ? String(variant.id) : undefined,
    variantSku: variant?.sku,
    inquiryOnly: product.inquiry_only || product.show_price_inquiry_mode || false,
    variants: product.variants || [],
  };
}
