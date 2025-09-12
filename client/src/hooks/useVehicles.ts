import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "../services/api"
import { toast } from "sonner"

export const useAdminVehicles = () => {
  return useQuery({
    queryKey: ["admin", "vehicles"],
    queryFn: adminApi.getVehicles,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => adminApi.createVehicle(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] })
      toast.success("Success", {
        description: "Vehicle created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create vehicle",
      })
    },
  })
}

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => adminApi.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] })
      toast.success("Success", {
        description: "Vehicle updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to update vehicle",
      })
    },
  })
}