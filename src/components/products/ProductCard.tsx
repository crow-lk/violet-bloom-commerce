import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const showPrice = !product.inquiryOnly && product.price > 0;

  if (view === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="glass rounded-xl overflow-hidden flex gap-4 p-4"
      >
        <Link to={`/product/${product.slug}`} className="w-40 h-40 flex-shrink-0">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" loading="lazy" />
        </Link>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-display font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
                </Link>
              </div>
              {product.discount && <Badge className="gradient-purple text-primary-foreground border-0">{product.discount}% OFF</Badge>}
            </div>
            {product.shortDescription && <p className="text-sm text-muted-foreground mt-1">{product.shortDescription}</p>}
            {product.rating !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                {product.reviewCount !== undefined && (
                  <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-primary">
                {showPrice ? formatPrice(product.price) : "Contact for price"}
              </span>
              {showPrice && product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={cn("h-5 w-5", wishlisted && "fill-destructive text-destructive")} />
              </Button>
              <Button size="sm" onClick={() => addItem(product)} disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.inStock ? "Add" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-xl overflow-hidden group relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount && (
          <Badge className="gradient-purple text-primary-foreground border-0 text-xs">{product.discount}% OFF</Badge>
        )}
        {product.isNewArrival && (
          <Badge variant="secondary" className="text-xs">New</Badge>
        )}
        {!product.inStock && (
          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-semibold mt-1 line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.shortDescription && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.shortDescription}</p>
        )}

        {product.rating !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            {product.reviewCount !== undefined && (
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-display font-bold text-primary">
              {showPrice ? formatPrice(product.price) : "Contact for price"}
            </span>
            {showPrice && product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={() => addItem(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
