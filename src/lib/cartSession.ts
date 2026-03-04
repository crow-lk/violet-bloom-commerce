const CART_SESSION_KEY = "cart_session_id";

export function getCartSessionId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CART_SESSION_KEY) || "";
}

export function ensureCartSessionId() {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(CART_SESSION_KEY);
  if (existing) return existing;
  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `guest_${Date.now()}`;
  localStorage.setItem(CART_SESSION_KEY, generated);
  return generated;
}
