import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Package, RefreshCw, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAccountOrders, getAccountOrderTracking } from "@/lib/api";
import { ApiAccountOrder, ApiOrderTracking } from "@/lib/api/types";

const formatMoney = (amount: number | string, currency: string) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency }).format(Number(amount));

const formatStatus = (status?: string | null) =>
  status ? status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Pending";

const trackingRecords = (tracking: unknown): Record<string, unknown>[] => {
  if (Array.isArray(tracking)) {
    return tracking.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  }

  if (!tracking || typeof tracking !== "object") {
    return [];
  }

  const object = tracking as Record<string, unknown>;
  const nestedRecords = Object.values(object).find(Array.isArray);

  return nestedRecords
    ? nestedRecords.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    : [object];
};

const visibleFields = (record: Record<string, unknown>) =>
  Object.entries(record).filter(([, value]) => value === null || ["string", "number", "boolean"].includes(typeof value));

export default function OrderHistory() {
  const [orders, setOrders] = useState<ApiAccountOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState<number | null>(null);
  const [tracking, setTracking] = useState<Record<number, ApiOrderTracking>>({});

  const loadOrders = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAccountOrders();
      setOrders(response.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load your orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const trackOrder = async (order: ApiAccountOrder) => {
    setTrackingOrderId(order.id);
    setError("");

    try {
      const response = await getAccountOrderTracking(order.id);
      setTracking((current) => ({ ...current, [order.id]: response }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to retrieve tracking details.");
    } finally {
      setTrackingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading your orders...
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
        <p className="mb-3 text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={() => void loadOrders()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-10 text-center">
        <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => setError("")}>
            Dismiss
          </Button>
        </div>
      )}

      {orders.map((order) => {
        const orderTracking = tracking[order.id];
        const records = orderTracking ? trackingRecords(orderTracking.tracking) : [];

        return (
          <article key={order.id} className="rounded-xl border border-border/60 bg-background/50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">Order #{order.order_number}</h3>
                  <Badge variant="secondary">{formatStatus(order.fulfillment_status || order.status)}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {order.created_at && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" /> {new Date(order.created_at).toLocaleDateString("en-LK")}
                    </span>
                  )}
                  {order.waybill && <span>Waybill: {order.waybill}</span>}
                  {order.payment_method && <span>{order.payment_method}</span>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="font-semibold">{formatMoney(order.grand_total, order.currency)}</span>
                <Button
                  size="sm"
                  onClick={() => void trackOrder(order)}
                  disabled={!order.waybill || trackingOrderId === order.id}
                >
                  {trackingOrderId === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
                  {order.waybill ? "Track order" : "Awaiting shipment"}
                </Button>
              </div>
            </div>

            {order.items.length > 0 && (
              <div className="mt-4 divide-y divide-border/60 border-t border-border/60">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-muted-foreground">
                        {[item.variant_name, item.sku].filter(Boolean).join(" / ")}{item.variant_name || item.sku ? " / " : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0">{formatMoney(item.line_total, order.currency)}</span>
                  </div>
                ))}
              </div>
            )}

            {orderTracking && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4 text-primary" /> Delivery tracking
                </div>
                {records.length > 0 ? (
                  <div className="space-y-3">
                    {records.map((record, index) => (
                      <div key={index} className="grid gap-2 rounded-lg bg-background/70 p-3 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleFields(record).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-muted-foreground">{formatStatus(key)}</p>
                            <p className="break-words text-sm font-medium">{value === null ? "-" : String(value)}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Koombiyo has not posted a tracking update yet.</p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
