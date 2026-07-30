export function toDeliveryAmount(value: number | string | null | undefined): number {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount : 0;
}
