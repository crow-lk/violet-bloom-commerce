import { useState } from "react";
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

type OrderStatus = "processing" | "packing" | "shipped" | "out_for_delivery" | "delivered";

type TrackingStep = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
};

type OrderDetail = {
  orderId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  estimatedDelivery: string;
};

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<OrderDetail | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockOrder: OrderDetail = {
    orderId: "ORD-2024-001234",
    productName: "Premium Wireless Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    quantity: 1,
    price: 2499.00,
    totalAmount: 2499.00,
    paymentMethod: "Credit Card (**** 4242)",
    shippingAddress: "123 Main Street, Colombo 07, Sri Lanka",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    orderDate: "2024-06-01",
    estimatedDelivery: "2024-06-05",
  };

  const getTrackingSteps = (status: OrderStatus): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: "processing",
        title: "Order Processing",
        description: "Your order has been received and is being processed",
        date: "Jun 1, 2024",
        time: "10:30 AM",
        completed: true,
        current: false,
      },
      {
        id: "packing",
        title: "Packing",
        description: "Your order is being packed with care",
        date: "Jun 1, 2024",
        time: "02:15 PM",
        completed: true,
        current: false,
      },
      {
        id: "shipped",
        title: "Shipped",
        description: "Your order has been shipped from our warehouse",
        date: "Jun 2, 2024",
        time: "09:00 AM",
        completed: true,
        current: false,
      },
      {
        id: "out_for_delivery",
        title: "Out for Delivery",
        description: "Your order is out for delivery",
        date: "Jun 4, 2024",
        time: "08:30 AM",
        completed: status === "out_for_delivery" || status === "delivered",
        current: status === "out_for_delivery",
      },
      {
        id: "delivered",
        title: "Delivered",
        description: "Your order has been delivered successfully",
        date: "Estimated: Jun 5, 2024",
        time: "By 06:00 PM",
        completed: status === "delivered",
        current: status === "delivered",
      },
    ];

    return steps;
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      const statuses: OrderStatus[] = ["processing", "packing", "shipped", "out_for_delivery", "delivered"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      setTrackedOrder(mockOrder);
      setTrackingSteps(getTrackingSteps(randomStatus));
      setIsSearching(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      processing: { variant: "secondary", label: "Processing" },
      packing: { variant: "secondary", label: "Packing" },
      shipped: { variant: "default", label: "Shipped" },
      out_for_delivery: { variant: "default", label: "Out for Delivery" },
      delivered: { variant: "outline", label: "Delivered" },
    };

    const badge = badges[status] || badges.processing;
    return (
      <Badge variant={badge.variant} className="gradient-purple text-white border-0">
        {badge.label}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3 text-gradient-purple">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">Enter your order ID to get real-time updates</p>
        </div>

        <form onSubmit={handleTrackOrder} className="max-w-xl mx-auto mb-12">
          <div className="glass rounded-2xl p-6 shadow-purple-lg">
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId" className="text-sm font-medium">Order ID</Label>
                <Input
                  id="orderId"
                  type="text"
                  placeholder="e.g., ORD-2024-001234"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mt-1.5 h-12"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 gradient-purple text-white font-semibold hover:opacity-90 transition-opacity" size="lg" disabled={isSearching}>
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Tracking Order...
                  </span>
                ) : (
                  "Track Order"
                )}
              </Button>
            </div>
          </div>
        </form>

        {trackedOrder && trackingSteps.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order Details
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">{trackedOrder.orderId}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 gradient-purple-radial">
                      <img
                        src={trackedOrder.productImage}
                        alt={trackedOrder.productName}
                        className="w-full h-full object-cover mix-blend-overlay opacity-80"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold">{trackedOrder.productName}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {trackedOrder.quantity}</p>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Unit Price</span>
                        <span className="font-medium">LKR {trackedOrder.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity</span>
                        <span className="font-medium">{trackedOrder.quantity}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="text-primary text-lg">LKR {trackedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Method</p>
                    <p className="text-sm font-medium">{trackedOrder.paymentMethod}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Date</p>
                    <p className="text-sm font-medium">{trackedOrder.orderDate}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. Delivery</p>
                    <p className="text-sm font-medium text-success">{trackedOrder.estimatedDelivery}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Tracking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {trackingSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                              step.completed
                                ? "gradient-purple border-primary text-white shadow-purple"
                                : step.current
                                ? "border-primary bg-primary/10 text-primary animate-pulse-glow"
                                : "border-muted-foreground/30 text-muted-foreground/50"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : step.current ? (
                              <Clock className="h-6 w-6 animate-spin" style={{ animationDuration: "3s" }} />
                            ) : (
                              <Package className="h-6 w-6" />
                            )}
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-16 ${
                                step.completed ? "gradient-purple-horizontal" : "bg-muted-foreground/20"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                              <h4 className={`font-display font-semibold ${step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                            </div>
                            <div className="flex items-center gap-3 sm:text-right">
                              <div>
                                <p className="text-xs font-medium text-foreground">{step.date}</p>
                                <p className="text-xs text-muted-foreground">{step.time}</p>
                              </div>
                              {step.current && (
                                <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{trackedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{trackedOrder.shippingAddress}</p>
                  <p className="text-sm text-muted-foreground">{trackedOrder.customerEmail}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!trackedOrder && !isSearching && (
          <div className="max-w-2xl mx-auto">
            <Card className="glass border-border/50">
              <CardContent className="py-12 text-center">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No Order Found</h3>
                <p className="text-muted-foreground">Please enter a valid order ID to track your order</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try: <span className="font-mono text-primary">ORD-2024-001234</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderTrackingPage;
