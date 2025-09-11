import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingsApi, adminApi } from "../services/api"
import { toast } from "sonner"

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...bookingKeys.lists(), { filters }] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] })
      toast.success("Success",{
        description: "Booking created successfully",
      })
      return data
    },
    onError: (error: any) => {
      toast("Error", {
        description: error.response?.data?.error || "Failed to create booking",
      })
    },
  })
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => bookingsApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] })
      toast.success("Success",{
        description: "Booking status updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error",{
        description: error.response?.data?.error || "Failed to update booking status",
      })
    },
  })
}

//admin Hooks
export const useAdminBookings = (params?: any) => {
  return useQuery({
    queryKey: ["admin", "bookings", params],
    queryFn: () => adminApi.getBookings(params),
    staleTime: 1 * 60 * 1000,
  })
}
