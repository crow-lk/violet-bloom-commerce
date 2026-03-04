import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { createPayment, placeOrder } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ensureCartSessionId } from "@/lib/cartSession";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { items, subtotal, taxTotal, discountTotal, total, clearCart } = useCart();
  const { methods } = usePaymentMethods();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.mobile || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
  });
  
  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      email: user.email || current.email,
      phone: user.mobile || current.phone,
    }));
  }, [user]);

  const activeMethods = useMemo(() => methods.filter((m) => m.active), [methods]);
  const [paymentMethodId, setPaymentMethodId] = useState<string>(activeMethods[0] ? String(activeMethods[0].id) : "");

  useEffect(() => {
    if (!paymentMethodId && activeMethods[0]) {
      setPaymentMethodId(String(activeMethods[0].id));
    }
  }, [activeMethods, paymentMethodId]);

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const selectedMethod = activeMethods.find((m) => String(m.id) === paymentMethodId);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethodId) {
      toast({ title: "Select a payment method", variant: "destructive" });
      return;
    }
    setIsPlacing(true);
    try {
      const sessionId = ensureCartSessionId();
      const shipping = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_line1: formData.address,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postalCode,
        email: formData.email,
        phone: formData.phone,
      };

      let paymentId: number | undefined;

      if (selectedMethod?.type === "online" || selectedMethod?.gateway) {
        const paymentRes = await createPayment({
          payment_method_id: Number(paymentMethodId),
          session_id: sessionId,
          customer: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postalCode,
          },
        });
        paymentId = paymentRes.payment.id;
      }

      const orderRes = await placeOrder({
        payment_id: paymentId,
        payment_method_id: paymentId ? undefined : Number(paymentMethodId),
        session_id: sessionId,
        shipping,
      });

      setOrderId(orderRes.order.order_number);
      setOrderPlaced(true);
      await clearCart();
    } catch (error: any) {
      toast({ title: "Order failed", description: error?.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle2 className="h-20 w-20 mx-auto text-success" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold mt-6">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">Thank you for your purchase. Your order ID is:</p>
          <p className="font-display text-xl font-bold text-primary mt-2">{orderId}</p>
          <p className="text-sm text-muted-foreground mt-4">You'll receive a confirmation email shortly. Track your order in your account.</p>
          <div className="flex gap-3 justify-center mt-8">
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate("/account")}>View Account</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" required className="mt-1" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" required className="mt-1" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required className="mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" required className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" required className="mt-1" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" required className="mt-1" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input id="postalCode" required className="mt-1" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
              {activeMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment methods available.</p>
              ) : (
                <RadioGroup value={paymentMethodId} onValueChange={setPaymentMethodId} className="space-y-3">
                  {activeMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethodId === String(method.id) ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <RadioGroupItem value={String(method.id)} />
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        {method.description && <p className="text-xs text-muted-foreground">{method.description}</p>}
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
              {selectedMethod?.type === "online" && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">You'll be redirected to complete payment securely.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.imageUrl || "/placeholder.svg"} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm text-success"><span>Discount</span><span>-{formatPrice(discountTotal)}</span></div>
              )}
              {taxTotal > 0 && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>{formatPrice(taxTotal)}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="font-display font-bold text-lg">Total</span><span className="font-display font-bold text-lg text-primary">{formatPrice(total)}</span></div>
            </div>
            <Button type="submit" className="w-full mt-6" size="lg" disabled={isPlacing || !paymentMethodId}>
              {isPlacing ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
