import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCatalog } from "@/hooks/useCatalog";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [imageDirection, setImageDirection] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedImage(0);
    setImageDirection(1);
  }, [slug]);

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
  const showPrice = !product.inquiryOnly && product.price > 0;

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
                  <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
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
                <Button size="lg" onClick={() => addItem(product, quantity)} disabled={!product.inStock || product.inquiryOnly} className="flex-1 h-11">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inquiryOnly ? "Inquiry Only" : product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} className="h-11 w-11 flex-shrink-0" >
                  <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
                </Button>
              </div>  
              <Button size="lg" onClick={async () => { await addItem(product, quantity); navigate("/checkout"); }} disabled={!product.inStock || product.inquiryOnly} className="w-full sm:w-auto h-11 bg-white border border-purple-600 text-purple-700 hover:bg-purple-50">
                Buy Now
              </Button>
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
