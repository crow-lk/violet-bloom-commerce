import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useDeliveryRates } from "@/hooks/useDeliveryRates";
import { createPayment, placeOrder } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ensureCartSessionId } from "@/lib/cartSession";
import { useToast } from "@/hooks/use-toast";
import { ApiCheckoutRedirect } from "@/lib/api/types";
import { LAUNCH_MODE } from "@/config/launch";
import { toDeliveryAmount } from "@/lib/delivery";

export default function CheckoutPage() {
  const { items, subtotal, taxTotal, discountTotal, total, clearCart } = useCart();
  const { methods } = usePaymentMethods();
  const { user } = useAuth();
  const { toast } = useToast();
  const sessionId = useMemo(() => ensureCartSessionId(), []);
  const {
    branches,
    districts,
    cities,
    selectedBranch,
    selectedDistrict,
    selectedCity,
    handleBranchChange,
    handleDistrictChange,
    handleCityChange,
    quote,
    quoteError,
    isQuoteLoading,
    isOptionsLoading,
  } = useDeliveryRates(sessionId);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      email: user.email || current.email,
      phone: user.mobile || current.phone,
    }));
  }, [user]);

  useEffect(() => {
    if (selectedCity) {
      setFormData((current) => ({ ...current, city: selectedCity }));
    }
  }, [selectedCity]);

  const activeMethods = useMemo(() => methods.filter((m) => m.active), [methods]);
  const [paymentMethodId, setPaymentMethodId] = useState<string>(activeMethods[0] ? String(activeMethods[0].id) : "");

  useEffect(() => {
    if (!paymentMethodId && activeMethods[0]) {
      setPaymentMethodId(String(activeMethods[0].id));
    }
  }, [activeMethods, paymentMethodId]);

  const selectedMethod = activeMethods.find((m) => String(m.id) === paymentMethodId);

  useEffect(() => {
    if (selectedMethod?.gateway !== "manual_bank") {
      setPaymentReceipt(null);
    }
  }, [selectedMethod]);

  if (LAUNCH_MODE) {
    return (
      <Layout>
        <div className="container mx-auto py-24 text-center">
          <h1 className="text-4xl font-bold">Checkout opens on launch day</h1>
          <p className="mt-3 text-muted-foreground">
            Create your account, browse products and build your wishlist while we prepare for launch.
          </p>
        </div>
      </Layout>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const selectedDeliveryRate = cities.find((city) => city.city === selectedCity);
  const deliveryRateId = selectedDeliveryRate?.delivery_rate_id;
  const isDeliveryQuoteReady = Boolean(
    deliveryRateId && quote?.delivery.delivery_rate_id === deliveryRateId
  );
  const shippingTotal = isDeliveryQuoteReady ? toDeliveryAmount(quote?.delivery.shipping_total) : 0;
  const grandTotal = isDeliveryQuoteReady ? toDeliveryAmount(quote?.grand_total) : total;

  const redirectToGateway = (checkout: ApiCheckoutRedirect) => {
    if (checkout.type !== "redirect" || !checkout.action_url) {
      return;
    }
    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkout.action_url;

    Object.entries(checkout.fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const buildPaymentPayload = (overrides: Record<string, unknown>) => {
    if (selectedMethod?.gateway === "manual_bank" && paymentReceipt) {
      const fd = new FormData();
      fd.append("payment_receipt", paymentReceipt);
      const flatten = (prefix: string, value: unknown) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
            flatten(`${prefix}[${k}]`, v);
          });
        } else {
          fd.append(prefix, String(value ?? ""));
        }
      };
      Object.entries(overrides).forEach(([key, value]) => {
        flatten(key, value);
      });
      return fd;
    }
    return overrides;
  };

  const validateForm = () => {
    const requiredFields = [
      { key: "firstName", value: formData.firstName, label: "First name" },
      { key: "lastName", value: formData.lastName, label: "Last name" },
      { key: "email", value: formData.email, label: "Email" },
      { key: "phone", value: formData.phone, label: "Phone" },
      { key: "address", value: formData.address, label: "Address" },
      { key: "postalCode", value: formData.postalCode, label: "Postal code" },
    ] as const;

    const missingField = requiredFields.find(({ value }) => !String(value || "").trim());
    if (missingField) {
      toast({ title: "Missing required information", description: `${missingField.label} is required.`, variant: "destructive" });
      return false;
    }

    if (selectedMethod?.gateway === "manual_bank" && !paymentReceipt) {
      toast({ title: "Upload payment receipt", variant: "destructive" });
      return false;
    }

    if (!isDeliveryQuoteReady) {
      toast({
        title: "Delivery quote required",
        description: quoteError || "Select a delivery city and wait for its delivery charge to be calculated.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsPlacing(true);
    try {
      if (selectedMethod?.type === "online" || selectedMethod?.gateway) {
        const paymentRes = await createPayment(
          buildPaymentPayload({
            payment_method_id: Number(paymentMethodId),
            session_id: sessionId,
            delivery_rate_id: deliveryRateId,
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
          })
        );

        if (paymentRes.checkout?.type === "redirect") {
          setIsRedirecting(true);
          redirectToGateway(paymentRes.checkout);
          return;
        }

        const orderRes = await placeOrder(
          buildPaymentPayload({
            payment_id: paymentRes.payment.id,
            session_id: sessionId,
            delivery_rate_id: deliveryRateId,
            shipping: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_line1: formData.address,
              city: formData.city,
              country: formData.country,
              postal_code: formData.postalCode,
              email: formData.email,
              phone: formData.phone,
            },
          })
        );

        setOrderId(orderRes.order.order_number);
        setOrderPlaced(true);
        await clearCart();
      } else {
        const orderRes = await placeOrder(
          buildPaymentPayload({
            payment_method_id: Number(paymentMethodId),
            session_id: sessionId,
            delivery_rate_id: deliveryRateId,
            shipping: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_line1: formData.address,
              city: formData.city,
              country: formData.country,
              postal_code: formData.postalCode,
              email: formData.email,
              phone: formData.phone,
            },
          })
        );

        setOrderId(orderRes.order.order_number);
        setOrderPlaced(true);
        await clearCart();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({ title: "Order failed", description: message, variant: "destructive" });
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
                  <Label htmlFor="branch">Dispatch Branch *</Label>
                  <Select value={selectedBranch} onValueChange={handleBranchChange} disabled={branches.length === 0 || isOptionsLoading}>
                    <SelectTrigger id="branch" className="mt-1">
                      <SelectValue placeholder={isOptionsLoading ? "Loading branches..." : "Select branch"} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedBranch || districts.length === 0 || isQuoteLoading || isOptionsLoading}>
                    <SelectTrigger id="district" className="mt-1">
                      <SelectValue placeholder={selectedBranch ? "Select district" : "Select branch first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedDistrict || cities.length === 0 || isQuoteLoading || isOptionsLoading}>
                    <SelectTrigger id="city" className="mt-1">
                      <SelectValue placeholder={selectedDistrict ? "Select city" : "Select district first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.delivery_rate_id} value={city.city}>
                          {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <div key={method.id} className="space-y-2">
                      <label
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethodId === String(method.id) ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value={String(method.id)} />
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          {method.description && <p className="text-xs text-muted-foreground">{method.description}</p>}
                        </div>
                      </label>
                      {paymentMethodId === String(method.id) && method.gateway === "manual_bank" && (
                        <div className="px-4 pb-2 space-y-4">
                          {method.instructions && (
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="text-sm font-semibold mb-2">Bank Transfer Instructions</h4>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{method.instructions}</pre>
                            </div>
                          )}
                          <div>
                            <Label htmlFor="paymentReceipt">Upload Payment Receipt</Label>
                            <Input
                              id="paymentReceipt"
                              type="file"
                              accept="image/*"
                              required
                              className="mt-1"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setPaymentReceipt(file);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}
              {selectedMethod?.type === "online" && selectedMethod?.gateway !== "manual_bank" && (
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{isQuoteLoading ? "Calculating..." : isDeliveryQuoteReady ? shippingTotal > 0 ? formatPrice(shippingTotal) : <span className="text-success">Free</span> : "Select a city"}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="font-display font-bold text-lg">Total</span><span className="font-display font-bold text-lg text-primary">{formatPrice(grandTotal)}</span></div>
            </div>
            {quoteError && <p className="mt-3 text-sm text-destructive">{quoteError}</p>}
            <Button type="submit" className="w-full mt-6" size="lg" disabled={isPlacing || isRedirecting || !paymentMethodId || !isDeliveryQuoteReady || (selectedMethod?.gateway === "manual_bank" && !paymentReceipt)}>
              {isRedirecting ? "Redirecting to PayHere..." : isPlacing ? "Placing Order..." : `Place Order — ${formatPrice(grandTotal)}`}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
