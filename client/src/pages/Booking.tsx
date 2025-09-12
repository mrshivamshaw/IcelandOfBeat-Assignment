"use client"

import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { tripsApi } from "../services/api"
import BookingStepper from "../components/booking/BookingStepper"

export default function BookingPage() {
  const { tripId } = useParams<{ tripId: string }>()

  const {
    data: trip,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripsApi.getById(tripId!),
    enabled: !!tripId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <p className="text-gray-600">The trip you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper trip={trip} />
    </div>
  )
}
