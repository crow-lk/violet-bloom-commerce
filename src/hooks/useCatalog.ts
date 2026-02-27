import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { mapProduct } from "@/lib/api/mappers";
import { ApiBrand, ApiCategory, ApiProduct } from "@/lib/api/types";

const fallbackArray = <T,>(value?: T[]) => (Array.isArray(value) ? value : []);

export function useCatalog() {
  const categoriesQuery = useQuery<ApiCategory[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const brandsQuery = useQuery<ApiBrand[]>({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const productsQuery = useQuery<ApiProduct[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = fallbackArray(categoriesQuery.data);
  const brands = fallbackArray(brandsQuery.data);

  const products = useMemo(() => {
    return fallbackArray(productsQuery.data).map((product) => mapProduct(product, categories, brands));
  }, [productsQuery.data, categories, brands]);

  return {
    categories,
    brands,
    products,
    isLoading: categoriesQuery.isLoading || brandsQuery.isLoading || productsQuery.isLoading,
    isError: categoriesQuery.isError || brandsQuery.isError || productsQuery.isError,
    error: categoriesQuery.error || brandsQuery.error || productsQuery.error,
    refetch: () => {
      categoriesQuery.refetch();
      brandsQuery.refetch();
      productsQuery.refetch();
    },
  };
}
