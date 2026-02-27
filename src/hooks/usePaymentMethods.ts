import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "@/lib/api";
import { ApiPaymentMethod } from "@/lib/api/types";

export function usePaymentMethods() {
  const query = useQuery<ApiPaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });

  return {
    methods: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
