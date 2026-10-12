import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LAUNCH_MODE } from "@/config/launch";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

function FlashSaleCountdown({ endsAt }: { endsAt: string }) {
  const getRemaining = useCallback(() => Math.max(0, new Date(endsAt).getTime() - Date.now()), [endsAt]);
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, [getRemaining]);

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining / 3_600_000) % 24);
  const minutes = Math.floor((remaining / 60_000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  const value = `${days > 0 ? `${days}d ` : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-1.5 rounded-lg bg-destructive/90 px-2.5 py-2 text-xs font-semibold text-destructive-foreground shadow-md backdrop-blur-sm">
      <Clock3 className="h-3.5 w-3.5" />
      <span>Ends in {value}</span>
    </div>
  );
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const showPrice = product.price > 0;
  const inquiryDisabled = product.inquiryOnly || product.showPriceInquiryMode;

  if (view === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="glass rounded-xl overflow-hidden flex gap-4 p-4"
      >
        <Link to={`/product/${product.slug}`} className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" loading="lazy" />
          {product.isFlashSale && product.flashSaleEndsAt && <FlashSaleCountdown endsAt={product.flashSaleEndsAt} />}
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
              {LAUNCH_MODE ? (
                <Button size="sm" disabled variant="secondary">
                  Launching Soon
                </Button>
              ) : (
                <Button size="sm" onClick={() => addItem(product)} disabled={!product.inStock || inquiryDisabled}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {product.inStock ? "Add" : "Out of Stock"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-xl"
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
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.isFlashSale && product.flashSaleEndsAt && <FlashSaleCountdown endsAt={product.flashSaleEndsAt} />}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
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

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-display font-bold text-primary">
              {showPrice ? formatPrice(product.price) : "Contact for price"}
            </span>
            {showPrice && product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {LAUNCH_MODE ? (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              disabled
              title="Shopping will be available on launch day"
            >
              <ShoppingCart className="h-4 w-4 opacity-60" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => addItem(product)}
              disabled={!product.inStock || inquiryDisabled}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
