import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, Menu, X, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { products } from "@/data/products";

export default function Navbar() {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="gradient-purple-horizontal py-1.5 -mx-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Facebook className="h-4 w-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.67a8.2 8.2 0 004.76 1.52v-3.5a4.84 4.84 0 01-1-.15z"/></svg>
            </a>
          </div>
          <p className="text-sm font-medium text-primary-foreground">
            🔥 Flash Sale: Use code <span className="font-bold">FLASH30</span> for 30% OFF — Limited Time!
          </p>
          <div className="w-20 hidden md:block" />
        </div>

        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ChuttakPay" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-display text-xl font-bold text-gradient-purple">ChuttakPay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Shop</Link>
            <Link to="/shop?filter=deals" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Deals</Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="h-9"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              {/* Suggestions dropdown */}
              {searchOpen && showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-60 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <img src={product.images[0]} alt={product.name} className="h-8 w-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Rs. {product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setSearchOpen(false);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-center text-sm text-primary py-2 hover:bg-muted transition-colors border-t border-border"
                  >
                    View all results
                  </button>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/account" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav className="flex flex-col gap-2 py-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 text-sm font-medium hover:text-primary">Home</Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 text-sm font-medium hover:text-primary">Shop</Link>
                <Link to="/shop?filter=deals" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 text-sm font-medium hover:text-primary">Deals</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 text-sm font-medium hover:text-primary">Contact</Link>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 text-sm font-medium hover:text-primary">Account</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
