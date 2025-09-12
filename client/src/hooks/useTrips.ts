import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tripsApi, adminApi } from "../services/api"
import { toast } from "sonner"

export const tripKeys = {
  all: ["trips"] as const,
  lists: () => [...tripKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...tripKeys.lists(), { filters }] as const,
  details: () => [...tripKeys.all, "detail"] as const,
  detail: (id: string) => [...tripKeys.details(), id] as const,
}

export const useTrips = () => {
  return useQuery({
    queryKey: tripKeys.lists(),
    queryFn: tripsApi.getAll,
    staleTime: 5 * 60 * 1000, 
  })
}

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useAdminTrips = () => {
  return useQuery({
    queryKey: ["admin", "trips"],
    queryFn: adminApi.getTrips,
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateTrip = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] })
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      toast.success("Success", {
        description: "Trip created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create trip",
      })
    },
  })
}

export const useUpdateTrip = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateTrip(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] })
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      toast.success("Success",{
        description: "Trip updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to update trip",
      })
    },
  })
}


export const useAdminAccommodations = () => {
  return useQuery({
    queryKey: ["admin", "accommodations"],
    queryFn: adminApi.getAccommodations,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdminVehicles = () => {
  return useQuery({
    queryKey: ["admin", "vehicles"],
    queryFn: adminApi.getVehicles,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdminActivities = () => {
  return useQuery({
    queryKey: ["admin", "activities"],
    queryFn: adminApi.getActivities,
    staleTime: 5 * 60 * 1000,
  })
}