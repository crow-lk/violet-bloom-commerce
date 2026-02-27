import { apiFetch } from "./client";
import {
  ApiAuthResponse,
  ApiBrand,
  ApiCart,
  ApiCategory,
  ApiOrder,
  ApiPaymentMethod,
  ApiProduct,
  ApiSettingsHeroImage,
  ApiSettingsWelcomePopup,
  ApiSettingsSocialLogin,
  ApiUser,
} from "./types";

export const getProducts = () => apiFetch<ApiProduct[]>("/products");
export const getCategories = () => apiFetch<ApiCategory[]>("/categories");
export const getBrands = () => apiFetch<ApiBrand[]>("/brands");
export const getPaymentMethods = () => apiFetch<ApiPaymentMethod[]>("/payment-methods");
export const getHeroImage = () => apiFetch<ApiSettingsHeroImage>("/settings/hero-image");
export const getWelcomePopup = () => apiFetch<ApiSettingsWelcomePopup>("/settings/welcome-popup");
export const getSocialLoginSettings = () => apiFetch<ApiSettingsSocialLogin>("/settings/social-login");

export const login = (payload: { email: string; password: string }) =>
  apiFetch<ApiAuthResponse>("/auth/login", { method: "POST", json: payload });

export const register = (payload: { name: string; email: string; mobile?: string; password: string }) =>
  apiFetch<ApiAuthResponse>("/auth/register", { method: "POST", json: payload });

export const logout = () => apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
export const getMe = () => apiFetch<ApiUser>("/auth/me");
export const updateProfile = (payload: { name: string; email: string; mobile?: string | null }) =>
  apiFetch<{ message: string; user: ApiUser }>("/profile", { method: "PUT", json: payload });

export const updatePassword = (payload: { current_password: string; password: string; password_confirmation: string }) =>
  apiFetch<{ message: string }>("/profile/password", { method: "PUT", json: payload });

export const getCart = (sessionId?: string) =>
  apiFetch<ApiCart>(`/cart${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""}`);

export const addCartItem = (payload: { product_variant_id: string; quantity: number; session_id?: string }) =>
  apiFetch<{ message: string; cart: ApiCart }>("/cart/items", { method: "POST", json: payload });

export const updateCartItem = (cartItemId: string, payload: { quantity?: number; product_variant_id?: string; session_id?: string }) =>
  apiFetch<{ message: string; cart: ApiCart }>(`/cart/items/${cartItemId}`, { method: "PUT", json: payload });

export const removeCartItem = (cartItemId: string, payload: { session_id?: string }) =>
  apiFetch<{ message: string; cart: ApiCart }>(`/cart/items/${cartItemId}`, { method: "DELETE", json: payload });

export const clearCart = (payload: { session_id?: string }) =>
  apiFetch<{ message: string; cart: ApiCart | null }>("/cart/clear", { method: "POST", json: payload });

export const mergeCart = (payload: { session_id: string }) =>
  apiFetch<{ message: string; cart: ApiCart }>("/cart/merge", { method: "POST", json: payload });

export const createPayment = (payload: Record<string, unknown>) =>
  apiFetch<{ message: string; payment: { id: number }; checkout?: unknown }>("/checkout/payments", {
    method: "POST",
    json: payload,
  });

export const placeOrder = (payload: Record<string, unknown>) =>
  apiFetch<{ message: string; order: ApiOrder }>("/checkout/orders", {
    method: "POST",
    json: payload,
  });
