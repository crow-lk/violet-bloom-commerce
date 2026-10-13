import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gem, Scissors, Sparkles, UtensilsCrossed, Home as HomeIcon, PenTool, Wrench, Baby, Coffee, SprayCan, ChevronLeft, ChevronRight, Mail, Star, Flame, TrendingUp, Gift } from "lucide-react";
import heroSaviorPack from "@/assets/hero-savior-pack-v2.png";
import heroEverydayFinds from "@/assets/hero-everyday-finds.png";
import hero1111Teaser from "@/assets/hero-11-11-teaser-v2.png";
import cod from "@/assets/cod.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";
import { useCatalog } from "@/hooks/useCatalog";
import { CATEGORIES, Product } from "@/types/product";
import { motion } from "framer-motion";
import LaunchBanner from "@/components/launch/LaunchBanner";
import { LAUNCH_MODE } from "@/config/launch";

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
  {
    title: "Savior Packs",
    subtitle: "Everyday favorites bundled to save the day",
    cta: "Shop Savior Packs",
    link: "/shop?filter=flash-sale",
    badge: "Limited-time picks",
    image: heroSaviorPack,
    embeddedText: true,
  },
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
    link: "/shop?category=jewellery-fashion-accessories",
    badge: "✨ Trending",
    image: heroEverydayFinds,
  },
  {
    title: "Home Essentials",
    subtitle: "Kitchen, storage & cleaning at unbeatable prices",
    cta: "Shop Home",
    link: "/shop?category=home-kitchen",
    badge: "🏠 New Arrivals",
    image: hero1111Teaser,
  },
  {
    title: "Kids' Favorites",
    subtitle: "Toys, stationery & fun accessories",
    cta: "Shop for Kids",
    link: "/shop?category=toys-kids-items",
    badge: "🎁 Gift Ideas",
    image: heroSaviorPack,
  },
];

const activeHeroSlides = [
  { title: "Savior Packs", image: heroSaviorPack },
  { title: "Everyday Finds", image: heroEverydayFinds },
  { title: "11.11 Offer Teaser", image: hero1111Teaser },
];

const PRODUCT_ROTATION_INTERVAL_MS = 15 * 60 * 1000;
const NEW_ARRIVALS_ROTATION_INTERVAL_MS = 5 * 60 * 1000;

const getRotationBucket = () => Math.floor(Date.now() / PRODUCT_ROTATION_INTERVAL_MS);
const getNewArrivalsRotationBucket = () => Math.floor(Date.now() / NEW_ARRIVALS_ROTATION_INTERVAL_MS);

function getRotatingProducts(items: Product[], count: number, rotationBucket: number, seedOffset: number): Product[] {
  let seed = rotationBucket + seedOffset;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

export default function Index() {
  const { products, categories } = useCatalog();
  const [rotationBucket, setRotationBucket] = useState(getRotationBucket);
  const [newArrivalsRotationBucket, setNewArrivalsRotationBucket] = useState(getNewArrivalsRotationBucket);
  const featuredCandidates = products.filter((p) => p.isFeatured);
  const trendingCandidates = products.filter((p) => p.isTrending);
  const featured = getRotatingProducts(
    featuredCandidates.length >= 6 ? featuredCandidates : products,
    6,
    rotationBucket,
    11
  );
  const trending = getRotatingProducts(
    trendingCandidates.length >= 8 ? trendingCandidates : products,
    8,
    rotationBucket,
    29
  );
  const deals = products
    .filter((p) => (p.discount || 0) > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 4);
  const flashSaleProducts = products
    .filter((product) => product.isFlashSale)
    .sort((a, b) => {
      if (!a.flashSaleEndsAt) return 1;
      if (!b.flashSaleEndsAt) return -1;
      return new Date(a.flashSaleEndsAt).getTime() - new Date(b.flashSaleEndsAt).getTime();
    });
  const fallbackFeatured = featured.length ? featured : products.slice(0, 6);
  const fallbackTrending = trending.length ? trending : products.slice(0, 8);
  const fallbackDeals = deals.length ? deals : products.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 50);
  const newArrivals = getRotatingProducts(latestProducts, 4, newArrivalsRotationBucket, 47);
  const carouselProducts = fallbackTrending.slice(0, 8);
  const categoryList = categories.length
    ? categories.map((cat) => ({ id: cat.slug, name: cat.name, icon: cat.slug }))
    : CATEGORIES;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);
  }, []);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    activeHeroSlides.forEach(({ image }) => {
      const preloadedImage = new Image();
      preloadedImage.src = image;
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setRotationBucket(getRotationBucket());
      interval = setInterval(() => setRotationBucket(getRotationBucket()), PRODUCT_ROTATION_INTERVAL_MS);
    }, PRODUCT_ROTATION_INTERVAL_MS - (Date.now() % PRODUCT_ROTATION_INTERVAL_MS));

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setNewArrivalsRotationBucket(getNewArrivalsRotationBucket());
      interval = setInterval(
        () => setNewArrivalsRotationBucket(getNewArrivalsRotationBucket()),
        NEW_ARRIVALS_ROTATION_INTERVAL_MS
      );
    }, NEW_ARRIVALS_ROTATION_INTERVAL_MS - (Date.now() % NEW_ARRIVALS_ROTATION_INTERVAL_MS));

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setCarouselIdx(0);
  }, [rotationBucket]);

  return (
    <Layout>
      {/* Hero Image Slider */}
      <section className="container mx-auto px-4">
        <div className="relative aspect-[2/1] overflow-hidden">
          {activeHeroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transform-gpu transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
              index === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.image}
              alt={slide.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          ))}

        {/* Slider Controls */}
          <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all shadow-lg border border-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
          <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all shadow-lg border border-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeHeroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-3 rounded-full transition-all shadow ${
                i === currentSlide ? "bg-white w-10" : "bg-white/40 w-3 hover:bg-white/60"
              }`}
            />
          ))}
          </div>
        </div>
      </section>

      {flashSaleProducts.length > 0 && (
        <section className="border-t border-destructive/15 bg-gradient-to-br from-destructive/10 via-background to-primary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="destructive" className="mb-3 gap-1.5">
                  <Flame className="h-3.5 w-3.5" /> Limited time
                </Badge>
                <div className="flex items-center gap-3">
                  <Flame className="h-7 w-7 text-destructive" />
                  <div>
                    <h2 className="font-display text-3xl font-bold">Savior Pack</h2>
                    <p className="mt-1 text-muted-foreground">Everyday essentials, ready to save the day.</p>
                  </div>
                </div>
              </div>
              <Link to="/shop?filter=flash-sale" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All Deals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {flashSaleProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {LAUNCH_MODE && <LaunchBanner />}

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

      {/* New Arrivals Carousel */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary" />
              <div>
                <h2 className="font-display text-3xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">Our latest products</p>
              </div>
            </div>
            <Link to="/shop?filter=new-arrivals" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((p, i) => (
              <motion.div
                key={p.id}
                className={i === 0 ? undefined : "hidden sm:block"}
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
                <p className="text-muted-foreground mt-1">Most Popular Products</p>
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
      {/* <section className="py-16">
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
      </section> */}

      {/* Chuttak Pay Membership */}
      {/*<section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold mb-4">ChuttakPay Membership</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our exclusive membership program to unlock special discounts, early access to new products,
              and enjoy seamless checkout with Chuttak Pay. Get 10% off your first purchase and earn points
              on every order.
            </p>
            <Button asChild size="lg" className="gradient-purple text-primary-foreground">
              <Link to="/membership">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>*/}

      {/* Promo Banners */}
      {/* <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto"> */}
            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-purple rounded-2xl p-8 text-primary-foreground"
            >
              <Badge className="bg-primary-foreground/20 border-0 text-primary-foreground mb-4">Limited Offer</Badge>
              <h3 className="font-display text-2xl font-bold">Free Shipping Month End Sunday</h3>
              <p className="mt-2 opacity-80">Free delivery on all orders this month end sunday only.</p>
              <Button asChild className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </motion.div> */}
{/* <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-foreground rounded-2xl p-8 text-background flex flex-col items-center text-center"
             >
              <div className="flex items-center justify-center gap-4 mb-4">
                <a href="" target="_blank">
                  <img src="https://www.payhere.lk/downloads/images/payhere_short_banner_dark.png" alt="PayHere" width="250" />
                </a>
                <img
                  src={cod}
                  alt="Cash on Delivery"
                  width="90"
                  height="90"
                  className="[filter:hue-rotate(265deg)_saturate(3)_brightness(0.9)]"
                />
              </div>
              <h3 className="font-display text-2xl font-bold">Pay Your Way</h3>
              <Button asChild className="mt-4" variant="secondary">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section> */}

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
            <p className="text-muted-foreground mt-2">Get our honest product reviews every week, with useful insights, recommendations, and new product highlights.</p>
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
