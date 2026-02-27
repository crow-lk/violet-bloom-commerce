import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { addCartItem, clearCart as apiClearCart, getCart, mergeCart, removeCartItem, updateCartItem } from "@/lib/api";
import { ApiCart } from "@/lib/api/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCatalog } from "@/hooks/useCatalog";
import { Product, CartItem } from "@/types/product";
import { ensureCartSessionId } from "@/lib/cartSession";

interface CartContextType {
  items: CartItem[];
  cartId?: string;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const toNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num : 0;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const { products } = useCatalog();
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useMemo(() => ensureCartSessionId(), []);
  const prevToken = useRef<string | null>(null);

  const productMap = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]));
  }, [products]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const data = await getCart(token ? undefined : sessionId);
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  useEffect(() => {
    const shouldMerge = token && token !== prevToken.current;
    prevToken.current = token;
    if (!shouldMerge) return;
    if (!sessionId) return;
    mergeCart({ session_id: sessionId })
      .then((res) => setCart(res.cart))
      .catch(() => loadCart());
  }, [token, sessionId]);

  const items: CartItem[] = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item) => {
      const product = productMap.get(String(item.product_id));
      return {
        id: String(item.id),
        productId: String(item.product_id),
        productSlug: product?.slug,
        productName: item.product_name,
        imageUrl: item.image_url || product?.images?.[0],
        brand: product?.brand,
        quantity: item.quantity,
        unitPrice: toNumber(item.unit_price),
        lineTotal: toNumber(item.line_total),
      };
    });
  }, [cart, productMap]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = async (product: Product, quantity = 1) => {
    if (!product.defaultVariantId) {
      toast({ title: "Unavailable", description: "This product cannot be added to cart yet.", variant: "destructive" });
      return;
    }
    if (product.inquiryOnly) {
      toast({ title: "Inquiry only", description: "This product is available on inquiry.", variant: "destructive" });
      return;
    }
    try {
      const res = await addCartItem({
        product_variant_id: product.defaultVariantId,
        quantity,
        session_id: token ? undefined : sessionId,
      });
      setCart(res.cart);
      toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
    } catch (error: any) {
      toast({ title: "Unable to add", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await removeCartItem(cartItemId, { session_id: token ? undefined : sessionId });
      setCart(res.cart);
    } catch (error: any) {
      toast({ title: "Unable to remove", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }
    try {
      const res = await updateCartItem(cartItemId, { quantity, session_id: token ? undefined : sessionId });
      setCart(res.cart);
    } catch (error: any) {
      toast({ title: "Unable to update", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };

  const clearCart = async () => {
    try {
      const res = await apiClearCart({ session_id: token ? undefined : sessionId });
      setCart(res.cart || null);
    } catch (error: any) {
      toast({ title: "Unable to clear", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartId: cart ? String(cart.id) : undefined,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal: toNumber(cart?.subtotal),
        taxTotal: toNumber(cart?.tax_total),
        discountTotal: toNumber(cart?.discount_total),
        total: toNumber(cart?.grand_total),
        itemCount,
        isLoading,
        refresh: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
