import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "../services/api"
import { toast } from "sonner"

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboard,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

export const useAdminActivities = () => {
  return useQuery({
    queryKey: ["admin", "activities"],
    queryFn: adminApi.getActivities,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("Success", {
        description: "Activity created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create activity",
      })
    },
  })
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) => 
      adminApi.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("Success", {
        description: "Activity updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to update activity",
      })
    },
  })
}

export const useDateRanges = () => {
  return useQuery({
    queryKey: ["admin", "pricing", "date-ranges"],
    queryFn: adminApi.getDateRanges,
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreateDateRange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.createDateRange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing", "date-ranges"] })
      toast.success("Success", {
        description: "Date range created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error",{
        description: error.response?.data?.error || "Failed to create date range",
      })
    },
  })
}

export const usePricingRules = () => {
  return useQuery({
    queryKey: ["admin", "pricing", "rules"],
    queryFn: adminApi.getPricingRules,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreatePricingRule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.createPricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing", "rules"] })
      toast.success("Success", {
        description: "Pricing rule created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error",{
        description: error.response?.data?.error || "Failed to create pricing rule",
      })
    },
  })
}
