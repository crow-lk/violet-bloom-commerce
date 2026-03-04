import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, taxTotal, discountTotal, total, itemCount, isLoading } = useCart();
  const navigate = useNavigate();

  if (isLoading && items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </Layout>
    );
  }

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
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="glass rounded-xl p-4 flex gap-4"
                >
                  <Link to={item.productSlug ? `/product/${item.productSlug}` : "/shop"} className="w-24 h-24 flex-shrink-0">
                    <img src={item.imageUrl || "/placeholder.svg"} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link to={item.productSlug ? `/product/${item.productSlug}` : "/shop"}>
                          <h3 className="font-display font-semibold hover:text-primary transition-colors">{item.productName}</h3>
                        </Link>
                        {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center glass rounded-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-display font-bold text-primary">{formatPrice(item.lineTotal)}</span>
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
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount</span>
                  <span>-{formatPrice(discountTotal)}</span>
                </div>
              )}
              {taxTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(taxTotal)}</span>
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

            <div className="mt-4 text-xs text-muted-foreground">
              Discounts and taxes are calculated at checkout.
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
