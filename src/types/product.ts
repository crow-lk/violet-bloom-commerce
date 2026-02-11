export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  brand: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
}

export type ProductCategory =
  | "jewelry"
  | "hair-accessories"
  | "beauty"
  | "kitchen"
  | "home"
  | "stationery"
  | "tools"
  | "toys"
  | "ceramics"
  | "cleaning";

export interface CartItem {
  product: Product;
  quantity: number;
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
