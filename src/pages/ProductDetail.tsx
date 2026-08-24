import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCatalog } from "@/hooks/useCatalog";
import { useToast } from "@/hooks/use-toast";
import { LAUNCH_MODE } from "@/config/launch";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [imageDirection, setImageDirection] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleBuyNow = async () => {
    await addItem(product, quantity);
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout.",
      });
      navigate("/account", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedImage(0);
    setImageDirection(1);
    setIsLightboxOpen(false);
  }, [slug]);

  useEffect(() => {
    if (!isLightboxOpen || !product?.images.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setImageDirection(-1);
        setSelectedImage((current) => (current - 1 + product.images.length) % product.images.length);
      }

      if (event.key === "ArrowRight") {
        setImageDirection(1);
        setSelectedImage((current) => (current + 1) % product.images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, product?.images.length]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Product not found</h1>
          <Button asChild className="mt-4"><Link to="/shop">Back to Shop</Link></Button>
        </div>
      </Layout>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id);
  const showPrice = product.price > 0;
  const inquiryDisabled = product.inquiryOnly || product.showPriceInquiryMode;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[120px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 lg:gap-12">
          {/* Images */}
          <div className="relative w-full min-w-0 md:pr-0 overflow-hidden">
            <div className="aspect-square rounded-2xl overflow-hidden glass">
              <AnimatePresence initial={false}>
                <motion.div
                  key={selectedImage}
                  initial={{ x: imageDirection > 0 ? "100%" : "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: imageDirection > 0 ? "-100%" : "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 100) {
                      setSelectedImage((prev) => Math.max(0, prev - 1));
                      setImageDirection(-1);
                    } else if (info.offset.x < -100) {
                      setSelectedImage((prev) => Math.min(product.images.length - 1, prev + 1));
                      setImageDirection(1);
                    }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                >
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="group relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    aria-label={`Open image ${selectedImage + 1} of ${product.images.length} in full screen`}
                  >
                    <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white opacity-100 backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            {product.images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 top-[45%] -translate-y-[45%] h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                  onClick={() => { setImageDirection(-1); setSelectedImage((prev) => Math.max(0, prev - 1)); }}
                  disabled={selectedImage === 0}
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-[45%] -translate-y-[45%] h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                  onClick={() => { setImageDirection(1); setSelectedImage((prev) => Math.min(product.images.length - 1, prev + 1)); }}
                  disabled={selectedImage === product.images.length - 1}
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </Button>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setImageDirection(i > selectedImage ? 1 : -1); setSelectedImage(i); }}
                      className={cn("flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors", i === selectedImage ? "border-primary" : "border-transparent")}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">{product.brand}</p>
            <h1 className="font-display text-xl sm:text-3xl font-bold mt-1 leading-tight break-words">{product.name}</h1>

            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3 w-3 sm:h-4 sm:w-4", i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                {product.reviewCount !== undefined && (
                  <span className="text-xs sm:text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3 mt-4 flex-wrap">
              <span className="font-display text-xl sm:text-3xl font-bold text-primary">
                {showPrice ? formatPrice(product.price) : "Contact for price"}
              </span>
              {showPrice && product.originalPrice && (
                <>
                  <span className="text-sm sm:text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge className="gradient-purple text-primary-foreground border-0 text-xs">{product.discount}% OFF</Badge>
                </>
              )}
            </div>

            {product.description && <p className="text-muted-foreground mt-4">{product.description}</p>}

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">Quantity</label>
              <div className="inline-flex items-center glass rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 sm:w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

             {/* Add to Cart & Buy Now */}
            <div className="flex flex-col gap-3 mt-6">

              <div className="flex items-center gap-3">

                  {LAUNCH_MODE ? (

                      <Button
                          size="lg"
                          disabled
                          className="flex-1 h-11"
                      >
                           Available on Launch Day
                      </Button>

                  ) : (

                      <Button
                          size="lg"
                          onClick={() => addItem(product, quantity)}
                          disabled={!product.inStock || product.inquiryOnly}
                          className="flex-1 h-11"
                      >
                          <ShoppingCart className="h-4 w-4 mr-2" />

                          {product.inquiryOnly
                              ? "Inquiry Only"
                              : product.inStock
                              ? "Add to Cart"
                              : "Out of Stock"}
                      </Button>

                  )}

                  <Button
                      size="lg"
                      variant="outline"
                      onClick={() => toggleWishlist(product.id)}
                      className="h-11 w-11"
                  >
                      <Heart
                          className={cn(
                              "h-4 w-4",
                              wishlisted &&
                                  "fill-destructive text-destructive"
                          )}
                      />
                  </Button>

              </div>

              {!LAUNCH_MODE && (

                  <Button
                      size="lg"
                      onClick={handleBuyNow}
                      disabled={!product.inStock || product.inquiryOnly}
                      className="bg-white border border-purple-600 text-purple-700 hover:bg-purple-50"
                  >
                      Buy Now
                  </Button>

              )}

          </div>

            {/* Payment Methods */}
            {/* <PaymentMethods /> */}

            {/* Trust badges */}
            {/* <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
              <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">7 Day Returns</span>
              </div>
            </div> */}
          </div>
        </div>

        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="h-[100dvh] w-screen max-w-none gap-0 border-0 bg-black/95 p-0 text-white shadow-none sm:rounded-none [&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:text-white [&>button]:opacity-100 [&>button]:backdrop-blur-sm [&>button_svg]:h-6 [&>button_svg]:w-6">
            <DialogTitle className="sr-only">{product.name} image gallery</DialogTitle>

            <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-16 sm:px-20">
              <AnimatePresence initial={false} custom={imageDirection} mode="popLayout">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={`${product.name} — image ${selectedImage + 1} of ${product.images.length}`}
                  custom={imageDirection}
                  initial={{ opacity: 0, x: imageDirection > 0 ? 80 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: imageDirection > 0 ? -80 : 80 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  drag={product.images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 80) {
                      setImageDirection(-1);
                      setSelectedImage((current) => (current - 1 + product.images.length) % product.images.length);
                    } else if (info.offset.x < -80) {
                      setImageDirection(1);
                      setSelectedImage((current) => (current + 1) % product.images.length);
                    }
                  }}
                  className="max-h-full max-w-full select-none object-contain"
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setImageDirection(-1);
                      setSelectedImage((current) => (current - 1 + product.images.length) % product.images.length);
                    }}
                    className="absolute left-3 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:left-6"
                    aria-label="View previous image"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setImageDirection(1);
                      setSelectedImage((current) => (current + 1) % product.images.length);
                    }}
                    className="absolute right-3 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:right-6"
                    aria-label="View next image"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-sm tabular-nums backdrop-blur-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-8 sm:mt-12">
          <TabsList className="glass w-full justify-start overflow-x-auto">
            <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews ({product.reviewCount || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="glass rounded-xl p-4 sm:p-6">
              {product.description ? (
                <p className="text-muted-foreground text-sm sm:text-base whitespace-pre-line">{product.description}</p>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">No description available yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="glass rounded-xl p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Reviews coming soon. This feature will be available when the backend is connected.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-display text-lg sm:text-2xl font-bold">Related Products</h2>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))} disabled={carouselIdx === 0} className="h-8 w-8 sm:h-10 sm:w-10">
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => setCarouselIdx(Math.min(relatedProducts.length - 4, carouselIdx + 1))} disabled={carouselIdx >= relatedProducts.length - 4} className="h-8 w-8 sm:h-10 sm:w-10">
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.slice(carouselIdx, carouselIdx + 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
