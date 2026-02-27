export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  categoryId?: string;
  brand?: string;
  brandId?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  specs?: Record<string, string>;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
  defaultVariantId?: string;
  variantSku?: string;
  inquiryOnly?: boolean;
  variants?: Array<{
    id: number;
    sku: string;
    size_name?: string | null;
    selling_price?: number | null;
    quantity?: number | null;
    status?: "active" | "inactive";
    color?: { id: number; name: string; hex?: string | null } | null;
  }>;
}

export type ProductCategory = string;

export interface CartItem {
  id: string;
  productId: string;
  productSlug?: string;
  productName: string;
  imageUrl?: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingInfo: ShippingInfo;
  paymentMethod: "card" | "mintpay";
  couponCode?: string;
  createdAt: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  orders: Order[];
  wishlist: string[];
}

export const CATEGORIES: { id: ProductCategory; name: string; icon: string }[] = [
  { id: "jewelry", name: "Jewelry", icon: "Gem" },
  { id: "hair-accessories", name: "Hair Accessories", icon: "Scissors" },
  { id: "beauty", name: "Beauty & Care", icon: "Sparkles" },
  { id: "kitchen", name: "Kitchen & Dining", icon: "UtensilsCrossed" },
  { id: "home", name: "Home & Living", icon: "Home" },
  { id: "stationery", name: "Stationery", icon: "PenTool" },
  { id: "tools", name: "Tools & Hardware", icon: "Wrench" },
  { id: "toys", name: "Toys & Kids", icon: "Baby" },
  { id: "ceramics", name: "Ceramics & Dinnerware", icon: "Coffee" },
  { id: "cleaning", name: "Cleaning Supplies", icon: "SprayCan" },
];
