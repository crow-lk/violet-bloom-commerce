import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; code: string; discount: number }
  | { type: "REMOVE_COUPON" }
  | { type: "LOAD_CART"; state: CartState };

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  WELCOME20: 20,
  FLASH30: 30,
  MEGA50: 50,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: action.quantity || 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { items: [], couponCode: null, couponDiscount: 0 };
    case "APPLY_COUPON":
      return { ...state, couponCode: action.code, couponDiscount: action.discount };
    case "REMOVE_COUPON":
      return { ...state, couponCode: null, couponDiscount: 0 };
    case "LOAD_CART":
      return action.state;
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = { items: [], couponCode: null, couponDiscount: 0 };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        dispatch({ type: "LOAD_CART", state: JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = Math.round(subtotal * (state.couponDiscount / 100));
  const total = subtotal - discountAmount;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = (product: Product, quantity?: number) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };
  const removeItem = (productId: string) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (code: string) => {
    const discount = COUPONS[code.toUpperCase()];
    if (discount) {
      dispatch({ type: "APPLY_COUPON", code: code.toUpperCase(), discount });
      toast({ title: "Coupon applied!", description: `You saved ${discount}%` });
      return true;
    }
    toast({ title: "Invalid coupon", description: "This coupon code is not valid.", variant: "destructive" });
    return false;
  };
  const removeCoupon = () => dispatch({ type: "REMOVE_COUPON" });

  return (
    <CartContext.Provider
      value={{
        items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount,
        addItem, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon,
        subtotal, discountAmount, total, itemCount,
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
