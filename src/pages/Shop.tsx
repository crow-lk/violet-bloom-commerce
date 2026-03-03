import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/products/ProductCard";
import SearchSuggestions from "@/components/products/SearchSuggestions";
import Layout from "@/components/layout/Layout";
import { useCatalog } from "@/hooks/useCatalog";
import { CATEGORIES, ProductCategory } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const { products, categories, brands, isLoading } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as ProductCategory | null;
  const initialSearch = searchParams.get("search") || "";
  const filterDeals = searchParams.get("filter") === "deals";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<ProductCategory | "">(initialCategory || "");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map((p) => p.price || 0)) : 0), [products]);
  const brandList = useMemo(() => {
    const fromApi = brands.map((b) => b.name).filter(Boolean);
    if (fromApi.length) return [...new Set(fromApi)].sort();
    return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  }, [brands, products]);
  const categoryList = categories.length
    ? categories.map((c) => ({ id: c.slug, name: c.name }))
    : CATEGORIES.map((c) => ({ id: c.id, name: c.name }));

  useEffect(() => {
    if (maxPrice <= 0) return;
    setPriceRange((current) => {
      if (current[0] === 0 && current[1] === 0) return [0, maxPrice];
      return current;
    });
  }, [maxPrice]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category) result = result.filter((p) => p.category === category);
    if (brand) result = result.filter((p) => p.brand === brand);
    if (filterDeals) result = result.filter((p) => p.discount && p.discount > 0);
    if (priceRange[1] > 0) {
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    switch (sort) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); break;
      case "rating": result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "discount": result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      default: result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
    return result;
  }, [products, search, category, brand, sort, priceRange, filterDeals]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch(""); setCategory(""); setBrand(""); setPriceRange([0, maxPrice]);
    setSearchParams({});
  };

  const activeFilterCount = [search, category, brand, filterDeals].filter(Boolean).length + (priceRange[0] > 0 || (maxPrice > 0 && priceRange[1] < maxPrice) ? 1 : 0);

  if (isLoading && products.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              {filterDeals ? "🔥 Hot Deals" : category ? categoryList.find((c) => c.id === category)?.name : "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchSuggestions
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              className="flex-1 md:w-64"
            />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="discount">Discount %</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")} className="hidden md:flex">
              {view === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="relative" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{activeFilterCount}</span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="glass rounded-xl p-4 w-64 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-sm font-medium mb-2">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryList.map((c) => (
                        <Badge
                          key={c.id}
                          variant={category === c.id ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => { setCategory(category === c.id ? "" : c.id); setPage(1); }}
                        >
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Brand */}
                  <div>
                    <p className="text-sm font-medium mb-2">Brand</p>
                    <Select value={brand} onValueChange={(v) => { setBrand(v === "all" ? "" : v); setPage(1); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brandList.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm font-medium mb-2">Price Range</p>
                    <Slider
                      value={priceRange}
                      onValueChange={(v) => { setPriceRange(v); setPage(1); }}
                      min={0}
                      max={maxPrice || 100}
                      step={500}
                      className="mt-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>LKR {priceRange[0].toLocaleString()}</span>
                      <span>LKR {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 container mx-auto">
            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryList.find((c) => c.id === category)?.name || category}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory("")} />
                  </Badge>
                )}
                {brand && <Badge variant="secondary" className="gap-1">Brand: {brand} <X className="h-3 w-3 cursor-pointer" onClick={() => setBrand("")} /></Badge>}
                {search && <Badge variant="secondary" className="gap-1">Search: {search} <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} /></Badge>}
              </div>
            )}

            <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
              {paginated.map((p) => (
                <ProductCard key={p.id} product={p} view={view} />
              ))}
            </div>

            {paginated.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl font-display font-semibold">No products found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground">…</span>
                    ) : (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p as number)} className="w-9">
                        {p}
                      </Button>
                    )
                  )}
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
