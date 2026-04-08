import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gem, Scissors, Sparkles, UtensilsCrossed, Home as HomeIcon, PenTool, Wrench, Baby, Coffee, SprayCan, ChevronLeft, ChevronRight, Mail, Star, Flame, TrendingUp, Gift } from "lucide-react";
import heroDeals from "@/assets/hero-deals.jpg";
import heroTrending from "@/assets/hero-trending.jpg";
import heroHome from "@/assets/hero-home.jpg";
import heroKids from "@/assets/hero-kids.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";
import { useCatalog } from "@/hooks/useCatalog";
import { CATEGORIES } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  jewelry: <Gem className="h-6 w-6" />,
  "hair-accessories": <Scissors className="h-6 w-6" />,
  beauty: <Sparkles className="h-6 w-6" />,
  kitchen: <UtensilsCrossed className="h-6 w-6" />,
  home: <HomeIcon className="h-6 w-6" />,
  stationery: <PenTool className="h-6 w-6" />,
  tools: <Wrench className="h-6 w-6" />,
  toys: <Baby className="h-6 w-6" />,
  ceramics: <Coffee className="h-6 w-6" />,
  cleaning: <SprayCan className="h-6 w-6" />,
  Gem: <Gem className="h-6 w-6" />,
  Scissors: <Scissors className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6" />,
  Home: <HomeIcon className="h-6 w-6" />,
  PenTool: <PenTool className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  Baby: <Baby className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  SprayCan: <SprayCan className="h-6 w-6" />,
};

const resolveCategoryIcon = (key: string) => CATEGORY_ICONS[key] || <Gem className="h-6 w-6" />;

// Hero Slider Data
const heroSlides = [
  // {
  //   title: "Discover Amazing Deals",
  //   subtitle: "Up to 33% OFF on Beauty & Care",
  //   cta: "Shop Now",
  //   link: "/shop?category=beauty",
  //   badge: "🔥 Hot Deals",
  //   image: heroDeals,
  // },
  {
    title: "Trending Jewelry",
    subtitle: "Elegant necklaces, earrings & bracelets",
    cta: "Explore Collection",
    link: "/shop?category=jewelry",
    badge: "✨ Trending",
    image: heroTrending,
  },
  {
    title: "Home Essentials",
    subtitle: "Kitchen, storage & cleaning at unbeatable prices",
    cta: "Shop Home",
    link: "/shop?category=kitchen",
    badge: "🏠 New Arrivals",
    image: heroHome,
  },
  {
    title: "Kids' Favorites",
    subtitle: "Toys, stationery & fun accessories",
    cta: "Shop for Kids",
    link: "/shop?category=toys",
    badge: "🎁 Gift Ideas",
    image: heroKids,
  },
];

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
  const { products, categories } = useCatalog();
  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const trending = products.filter((p) => p.isTrending).slice(0, 8);
  const deals = products
    .filter((p) => (p.discount || 0) > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 4);
  const fallbackFeatured = featured.length ? featured : products.slice(0, 6);
  const fallbackTrending = trending.length ? trending : products.slice(0, 8);
  const fallbackDeals = deals.length ? deals : products.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselProducts = fallbackTrending.slice(0, 8);
  const categoryList = categories.length
    ? categories.map((cat) => ({ id: cat.slug, name: cat.name, icon: cat.slug }))
    : CATEGORIES;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <Layout>
      {/* Hero Image Slider */}
      <section className="relative overflow-hidden h-[400px] md:h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
            <div className="container mx-auto px-4 h-full flex items-center relative">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Badge className="bg-white/20 text-white border-0 mb-4 text-sm backdrop-blur-sm">
                    {heroSlides[currentSlide].badge}
                  </Badge>
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-white/80 mt-4 text-lg md:text-xl drop-shadow">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <div className="flex gap-3 mt-8">
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                      <Link to={heroSlides[currentSlide].link}>
                        {heroSlides[currentSlide].cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                      <Link to="/shop?filter=deals">All Deals</Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all shadow-lg border border-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all shadow-lg border border-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-3 rounded-full transition-all shadow ${
                i === currentSlide ? "bg-white w-10" : "bg-white/40 w-3 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Flash Sale Banner */}
      {/* <section className="bg-gradient-to-r from-destructive/90 to-accent py-6 text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Flame className="h-6 w-6" /> Flash Sale
            </h2>
            <p className="text-sm opacity-90">Up to 33% off on selected items</p>
          </div>
          <CountdownTimer />
          <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/shop?filter=deals">Shop Deals</Link>
          </Button>
        </div>
      </section> */}

      {/* Categories Sidebar + Featured Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Categories Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="glass rounded-xl p-4 sticky top-24">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Categories
                </h3>
                <nav className="space-y-1">
                  {categoryList.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        to={`/shop?category=${cat.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all group"
                      >
                        <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                          {resolveCategoryIcon(cat.icon)}
                        </div>
                        {cat.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <Link to="/shop" className="block mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse All <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </motion.aside>

            {/* Featured Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-3xl font-bold flex items-center gap-2">
                    <Star className="h-7 w-7 text-primary" /> Featured
                  </h2>
                  <p className="text-muted-foreground mt-1">Hand-picked favorites just for you</p>
                </div>
                <Link to="/shop" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {fallbackFeatured.slice(0, 6).map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Categories Grid */}
      <section className="py-12 lg:hidden">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {categoryList.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="glass rounded-xl p-3 flex flex-col items-center gap-2 hover:shadow-purple transition-shadow group"
                >
                  <div className="gradient-purple p-2.5 rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
                    {resolveCategoryIcon(cat.icon)}
                  </div>
                  <span className="text-xs font-medium text-center">{cat.name}</span>
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
            <div className="flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-primary" />
              <div>
                <h2 className="font-display text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground mt-1">Most popular products this week</p>
              </div>
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
            {carouselProducts.slice(carouselIdx, carouselIdx + 4).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            <Flame className="h-7 w-7 text-destructive" /> Hot Deals
          </h2>
          <p className="text-muted-foreground text-center mb-10">Don't miss these limited-time offers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fallbackDeals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={p} />
              </motion.div>
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-purple rounded-2xl p-8 text-primary-foreground"
            >
              <Badge className="bg-primary-foreground/20 border-0 text-primary-foreground mb-4">Limited Offer</Badge>
              <h3 className="font-display text-2xl font-bold">Free Shipping Weekend</h3>
              <p className="mt-2 opacity-80">Free delivery on all orders this weekend only.</p>
              <Button asChild className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-foreground rounded-2xl p-8 text-background"
            >
              <Badge className="bg-primary border-0 text-primary-foreground mb-4">Mintpay</Badge>
              <h3 className="font-display text-2xl font-bold">Buy Now, Pay Later</h3>
              <p className="mt-2 opacity-80">Split your purchase into 3 easy payments with Mintpay. 0% interest.</p>
              <Button asChild className="mt-4" variant="secondary">
                <Link to="/shop">Shop with Mintpay</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-purple"
          >
            <Mail className="h-10 w-10 mx-auto text-primary mb-4" />
            <h2 className="font-display text-2xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground mt-2">Subscribe to get exclusive deals and new arrival alerts.</p>
            <form className="flex gap-2 mt-6 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
