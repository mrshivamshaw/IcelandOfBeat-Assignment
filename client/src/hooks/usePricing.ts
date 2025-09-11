import { useMutation } from "@tanstack/react-query"
import { pricingApi } from "../services/api"

export const usePricingCalculation = () => {
  return useMutation({
    mutationFn: pricingApi.calculate,
    retry: 2,
  })
}
