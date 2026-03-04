export interface ApiUser {
  id: number;
  name: string;
  email: string;
  mobile?: string | null;
  roles?: Array<{ id: number; name: string }>;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiColor {
  id: number;
  name: string;
  hex?: string | null;
}

export interface ApiVariant {
  id: number;
  sku: string;
  size_id?: number | null;
  size_name?: string | null;
  color?: ApiColor | null;
  colors?: ApiColor[];
  selling_price?: number | null;
  quantity?: number | null;
  status?: "active" | "inactive";
  mrp?: number | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku_prefix?: string | null;
  brand_id: number;
  category_id: number;
  collection_id?: number | null;
  collection_name?: string | null;
  season?: string | null;
  description?: string | null;
  care_instructions?: string | null;
  material_composition?: string | null;
  hs_code?: string | null;
  default_tax_id?: number | null;
  status?: string;
  quantity?: number | null;
  inquiry_only?: boolean;
  show_price_inquiry_mode?: boolean;
  variants: ApiVariant[];
  images: string[];
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiCartItem {
  id: number;
  product_variant_id: number;
  product_id: number;
  product_name: string;
  variant_display_name?: string | null;
  variant_sku?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  image_url?: string | null;
}

export interface ApiCart {
  id: number;
  user_id?: number | null;
  session_id?: string | null;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  grand_total: number;
  items: ApiCartItem[];
}

export interface ApiPaymentMethod {
  id: number;
  name: string;
  code?: string;
  type: "online" | "offline";
  gateway?: string | null;
  description?: string | null;
  icon_path?: string | null;
  instructions?: string | null;
  sort_order?: number | null;
  settings?: Record<string, unknown> | null;
  active: boolean;
}

export interface ApiPayment {
  id: number;
  cart_id?: number | null;
  order_id?: number | null;
  amount_paid: number;
  payment_method_id: number;
  gateway?: string | null;
  payment_status?: string;
  reference_number?: string | null;
  receipt_path?: string | null;
  created_at?: string;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  currency: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  shipping_total: number;
  grand_total: number;
  created_at?: string;
}

export interface ApiAuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiSettingsHeroImage {
  image_path?: string | null;
  image_url?: string | null;
}

export interface ApiSettingsWelcomePopup {
  image_path?: string | null;
  image_url?: string | null;
  description?: string | null;
  link_url?: string | null;
}

export interface ApiSettingsSocialLogin {
  providers: {
    google?: { enabled: boolean; client_id?: string; redirect?: string };
    facebook?: { enabled: boolean; client_id?: string; redirect?: string };
  };
}
