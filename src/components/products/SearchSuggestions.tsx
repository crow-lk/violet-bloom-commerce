import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface SearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchSuggestions({ value, onChange, className }: SearchSuggestionsProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 2) return [];
    const q = value.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      )
      .slice(0, 8);
  }, [value]);

  useEffect(() => {
    setOpen(suggestions.length > 0);
    setHighlighted(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectProduct = (productId: string) => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectProduct(suggestions[highlighted].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-8"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((product, i) => (
            <button
              key={product.id}
              onClick={() => selectProduct(product.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors ${
                i === highlighted ? "bg-accent" : ""
              }`}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-9 w-9 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand} · LKR {(product.price / 100).toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
