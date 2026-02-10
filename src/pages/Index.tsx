import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Laptop, Headphones, Watch, Tablet, Gamepad2, Camera, Cable, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";
import { products, getFeaturedProducts, getTrendingProducts, getDiscountedProducts, formatPrice } from "@/data/products";
import { CATEGORIES } from "@/types/product";
import { motion } from "framer-motion";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-6 w-6" />,
  Laptop: <Laptop className="h-6 w-6" />,
  Cable: <Cable className="h-6 w-6" />,
  Headphones: <Headphones className="h-6 w-6" />,
  Watch: <Watch className="h-6 w-6" />,
  Tablet: <Tablet className="h-6 w-6" />,
  Gamepad2: <Gamepad2 className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
};

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 18 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 23, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <div className="flex gap-2">
      {[
        { label: "HRS", value: pad(time.hours) },
        { label: "MIN", value: pad(time.minutes) },
        { label: "SEC", value: pad(time.seconds) },
      ].map((t) => (
        <div key={t.label} className="bg-background/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
          <p className="font-display text-2xl font-bold">{t.value}</p>
          <p className="text-xs opacity-80">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const featured = getFeaturedProducts();
  const trending = getTrendingProducts();
  const deals = getDiscountedProducts().slice(0, 4);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselProducts = trending.slice(0, 8);

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full bg-primary-foreground/20 -top-20 -right-20 blur-3xl" />
          <div className="absolute w-64 h-64 rounded-full bg-primary-foreground/10 bottom-10 left-10 blur-2xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-4">🔥 New Arrivals</Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Next-Gen Tech<br />
                <span className="text-primary-foreground/80">At Your Fingertips</span>
              </h1>
              <p className="text-primary-foreground/70 mt-4 text-lg max-w-md">
                Discover the latest electronics with exclusive deals, fast delivery, and Mintpay BNPL options.
              </p>
              <div className="flex gap-3 mt-8">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                  <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/shop?filter=deals">View Deals</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="glass rounded-2xl p-6 shadow-purple-lg">
                  <img src={featured[0]?.images[0]} alt={featured[0]?.name} className="w-full rounded-xl" />
                  <div className="mt-4">
                    <p className="font-display text-xl font-bold text-primary-foreground">{featured[0]?.name}</p>
                    <p className="text-primary-foreground/80 text-2xl font-bold mt-1">{featured[0] && formatPrice(featured[0].price)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-destructive/90 to-accent py-6 text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">⚡ Flash Sale</h2>
            <p className="text-sm opacity-90">Up to 30% off on selected electronics</p>
          </div>
          <CountdownTimer />
          <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/shop?filter=deals">Shop Deals</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-2">Shop by Category</h2>
          <p className="text-muted-foreground text-center mb-10">Find exactly what you're looking for</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="glass rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-purple transition-shadow group"
                >
                  <div className="gradient-purple p-3 rounded-xl text-primary-foreground group-hover:scale-110 transition-transform">
                    {CATEGORY_ICONS[cat.icon]}
                  </div>
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Carousel */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Trending Now</h2>
              <p className="text-muted-foreground mt-1">Most popular products this week</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))} disabled={carouselIdx === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setCarouselIdx(Math.min(carouselProducts.length - 4, carouselIdx + 1))} disabled={carouselIdx >= carouselProducts.length - 4}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carouselProducts.slice(carouselIdx, carouselIdx + 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-2">🔥 Hot Deals</h2>
          <p className="text-muted-foreground text-center mb-10">Don't miss these limited-time offers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop?filter=deals">View All Deals <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gradient-purple rounded-2xl p-8 text-primary-foreground">
              <Badge className="bg-primary-foreground/20 border-0 text-primary-foreground mb-4">Limited Offer</Badge>
              <h3 className="font-display text-2xl font-bold">Buy 1 Get 1 Free</h3>
              <p className="mt-2 opacity-80">On selected accessories this weekend only.</p>
              <Button asChild className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/shop?category=accessories">Shop Accessories</Link>
              </Button>
            </div>
            <div className="bg-foreground rounded-2xl p-8 text-background">
              <Badge className="bg-primary border-0 text-primary-foreground mb-4">Mintpay</Badge>
              <h3 className="font-display text-2xl font-bold">Buy Now, Pay Later</h3>
              <p className="mt-2 opacity-80">Split your purchase into 3 easy payments with Mintpay. 0% interest.</p>
              <Button asChild className="mt-4" variant="secondary">
                <Link to="/shop">Shop with Mintpay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-purple">
            <Mail className="h-10 w-10 mx-auto text-primary mb-4" />
            <h2 className="font-display text-2xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground mt-2">Subscribe to get exclusive deals and new arrival alerts.</p>
            <form className="flex gap-2 mt-6 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
