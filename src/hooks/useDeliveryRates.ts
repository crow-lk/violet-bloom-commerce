import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeliveryRateOptions, getDeliveryQuote } from "@/lib/api";
import {
  ApiDeliveryRateOptions,
  ApiDeliveryRateQuoteResponse,
} from "@/lib/api/types";
import { useState, useEffect, useCallback } from "react";

export function useDeliveryRates(sessionId: string) {
  const queryClient = useQueryClient();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const optionsQuery = useQuery<ApiDeliveryRateOptions>({
    queryKey: ["delivery-rates-options", selectedBranch, selectedDistrict],
    queryFn: () => getDeliveryRateOptions(selectedBranch || undefined, selectedDistrict || undefined),
    enabled: !!sessionId,
  });

  const branches = optionsQuery.data?.branches ?? [];
  const districts = optionsQuery.data?.districts ?? [];
  const cities = optionsQuery.data?.cities ?? [];

  useEffect(() => {
    if (optionsQuery.data && !selectedBranch && optionsQuery.data.selected_branch) {
      setSelectedBranch(optionsQuery.data.selected_branch);
    }
  }, [optionsQuery.data, selectedBranch]);

  const [quote, setQuote] = useState<ApiDeliveryRateQuoteResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    if (optionsQuery.isFetching) {
      setQuoteError(null);
    }
  }, [optionsQuery.isFetching]);

  const quoteMutation = useMutation<ApiDeliveryRateQuoteResponse, Error, { delivery_rate_id: number }>({
    mutationFn: ({ delivery_rate_id }) =>
      getDeliveryQuote({
        session_id: sessionId,
        delivery_rate_id,
      }),
    onMutate: () => setQuoteError(null),
    onSuccess: (data) => {
      setQuoteError(null);
      setQuote(data);
      queryClient.setQueryData(["delivery-quote", sessionId], data);
    },
    onError: (error) => {
      setQuoteError(error.message || "Failed to calculate delivery quote");
    },
  });

  const handleBranchChange = useCallback((branch: string) => {
    setSelectedBranch(branch);
    setSelectedDistrict("");
    setSelectedCity("");
    setQuote(null);
    queryClient.removeQueries({ queryKey: ["delivery-quote", sessionId] });
  }, [queryClient, sessionId]);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    setSelectedCity("");
    setQuote(null);
    queryClient.removeQueries({ queryKey: ["delivery-quote", sessionId] });
  }, [queryClient, sessionId]);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setQuote(null);
    const cityData = (optionsQuery.data?.cities ?? []).find((c) => c.city === city);
    if (cityData) {
      quoteMutation.mutate({ delivery_rate_id: cityData.delivery_rate_id });
    }
  }, [optionsQuery.data, quoteMutation]);

  return {
    branches,
    districts,
    cities,
    selectedBranch,
    selectedDistrict,
    selectedCity,
    handleBranchChange,
    handleDistrictChange,
    handleCityChange,
    quote,
    quoteError,
    isQuoteLoading: quoteMutation.isPending,
    isOptionsLoading: optionsQuery.isFetching,
  };
}
