import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, discountAmount, total, couponCode, couponDiscount, applyCoupon, removeCoupon, itemCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Discover amazing products and add them to your cart.</p>
          <Button asChild className="mt-6"><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="glass rounded-xl p-4 flex gap-4"
                >
                  <Link to={`/product/${item.product.slug}`} className="w-24 h-24 flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/product/${item.product.slug}`}>
                          <h3 className="font-display font-semibold hover:text-primary transition-colors">{item.product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center glass rounded-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-display font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-sm text-success">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {couponCode} (-{couponDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-lg text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4">
              {couponCode ? (
                <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <span className="text-sm font-medium">🎉 {couponCode}</span>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>Remove</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => { applyCoupon(couponInput); setCouponInput(""); }}>
                    Apply
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">Try: SAVE10, WELCOME20, FLASH30</p>
            </div>

            <Button className="w-full mt-6" size="lg" onClick={() => navigate("/checkout")}>
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Mint Pay */}
            <div className="mt-3 p-3 glass rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Or pay with</p>
              <p className="font-display font-bold text-primary">Mintpay</p>
              <p className="text-xs text-muted-foreground">3x {formatPrice(Math.round(total / 3))} / month</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
