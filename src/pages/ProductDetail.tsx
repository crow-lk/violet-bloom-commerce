import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCatalog } from "@/hooks/useCatalog";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products, isLoading } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const showPrice = !product.inquiryOnly && product.price > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-2xl overflow-hidden glass"
            >
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn("w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors", i === selectedImage ? "border-primary" : "border-transparent")}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.brand}</p>
            <h1 className="font-display text-3xl font-bold mt-1">{product.name}</h1>

            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                {product.reviewCount !== undefined && (
                  <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <span className="font-display text-3xl font-bold text-primary">
                {showPrice ? formatPrice(product.price) : "Contact for price"}
              </span>
              {showPrice && product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge className="gradient-purple text-primary-foreground border-0">{product.discount}% OFF</Badge>
                </>
              )}
            </div>

            {product.description && <p className="text-muted-foreground mt-4">{product.description}</p>}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center glass rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button size="lg" onClick={() => addItem(product, quantity)} disabled={!product.inStock || product.inquiryOnly} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inquiryOnly ? "Inquiry Only" : product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)}>
                <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
              </Button>
            </div>

            {/* Mint Pay */}
            <div className="glass rounded-xl p-4 mt-4">
              <p className="font-medium text-sm">Or pay in 3 interest-free installments with</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="font-display font-bold text-lg text-primary">Mintpay</span>
                  {showPrice && <p className="text-sm text-muted-foreground">3x {formatPrice(Math.round(product.price / 3))} / month</p>}
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">7 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mt-12">
          <TabsList className="glass">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-4">
            <div className="glass rounded-xl p-6">
              {Object.keys(product.specs || {}).length === 0 ? (
                <p className="text-sm text-muted-foreground">No specifications available yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="glass rounded-xl p-6 text-center">
              <p className="text-muted-foreground">Reviews coming soon. This feature will be available when the backend is connected.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
