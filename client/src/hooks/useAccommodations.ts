import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "../services/api"
import { toast } from "sonner"

export const useAdminAccommodations = () => {
  return useQuery({
    queryKey: ["admin", "accommodations"],
    queryFn: adminApi.getAccommodations,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateAccommodation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => adminApi.createAccommodation(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "accommodations"] })
      toast.success("Success", {
        description: "Accommodation created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create accommodation",
      })
    },
  })
}

export const useUpdateAccommodation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => adminApi.updateAccommodation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "accommodations"] })
      toast.success("Success", {
        description: "Accommodation updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to update accommodation",
      })
    },
  })
}