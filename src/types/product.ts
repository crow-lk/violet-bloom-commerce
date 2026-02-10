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
  | "phones"
  | "laptops"
  | "accessories"
  | "audio"
  | "wearables"
  | "tablets"
  | "gaming"
  | "cameras";

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
  { id: "phones", name: "Phones", icon: "Smartphone" },
  { id: "laptops", name: "Laptops", icon: "Laptop" },
  { id: "accessories", name: "Accessories", icon: "Cable" },
  { id: "audio", name: "Audio", icon: "Headphones" },
  { id: "wearables", name: "Wearables", icon: "Watch" },
  { id: "tablets", name: "Tablets", icon: "Tablet" },
  { id: "gaming", name: "Gaming", icon: "Gamepad2" },
  { id: "cameras", name: "Cameras", icon: "Camera" },
];
