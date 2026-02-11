import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, total, couponCode, couponDiscount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() => `CP-${Date.now().toString(36).toUpperCase()}`);
  const navigate = useNavigate();

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle2 className="h-20 w-20 mx-auto text-success" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold mt-6">Order Confirmed! 🎉</h1>
          <p className="text-muted-foreground mt-2">Thank you for your purchase. Your order ID is:</p>
          <p className="font-display text-xl font-bold text-primary mt-2">{orderId}</p>
          <p className="text-sm text-muted-foreground mt-4">You'll receive a confirmation email shortly. Track your order in your account.</p>
          <div className="flex gap-3 justify-center mt-8">
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate("/account")}>View Orders</Button>
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
                <div><Label htmlFor="firstName">First Name *</Label><Input id="firstName" required className="mt-1" /></div>
                <div><Label htmlFor="lastName">Last Name *</Label><Input id="lastName" required className="mt-1" /></div>
                <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" required className="mt-1" /></div>
                <div><Label htmlFor="phone">Phone *</Label><Input id="phone" type="tel" required className="mt-1" /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Address *</Label><Input id="address" required className="mt-1" /></div>
                <div><Label htmlFor="city">City *</Label><Input id="city" required className="mt-1" /></div>
                <div><Label htmlFor="postalCode">Postal Code *</Label><Input id="postalCode" required className="mt-1" /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="card" />
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "mintpay" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="mintpay" />
                  <div className="gradient-purple text-primary-foreground text-xs font-bold px-2 py-1 rounded">MP</div>
                  <div>
                    <p className="font-medium">Mintpay — Buy Now Pay Later</p>
                    <p className="text-xs text-muted-foreground">Split into 3 interest-free payments of {formatPrice(Math.round(total / 3))}</p>
                  </div>
                </label>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">Card payment form will appear here when payment gateway is connected.</p>
                </div>
              )}
              {paymentMethod === "mintpay" && (
                <div className="mt-4 p-4 gradient-purple rounded-lg text-primary-foreground text-center">
                  <p className="font-display font-bold">Mintpay</p>
                  <p className="text-sm opacity-80 mt-1">You'll be redirected to Mintpay to complete your purchase.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {couponCode && <div className="flex justify-between text-sm text-success"><span>{couponCode} (-{couponDiscount}%)</span><span>-{formatPrice(discountAmount)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="font-display font-bold text-lg">Total</span><span className="font-display font-bold text-lg text-primary">{formatPrice(total)}</span></div>
            </div>
            <Button type="submit" className="w-full mt-6" size="lg">
              Place Order — {formatPrice(total)}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
