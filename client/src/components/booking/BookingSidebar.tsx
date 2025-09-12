"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pricing, Trip } from "@/types/types"
import BookingSideBarpoints from "./BookingSideBarpoints"


interface BookingSidebarProps {
  bookingData: any
  tripData: Trip
  pricing: Pricing
  getAccommodationName: () => string
  getVehicleName: () => string
}

export default function BookingSidebar({
  bookingData,
  tripData,
  pricing,
  getAccommodationName,
  getVehicleName,
}: BookingSidebarProps) {
const formatDate = (date?: Date | string) => {
  if (!date) return "Not selected"

  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "Invalid date"

  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })
    .toUpperCase()
}


  const formatPrice = (price: number, currency = "ISK") => {
    return `${price?.toLocaleString()} ${currency}`
  }

  const getTravelerText = () => {
    const parts = []
    if (bookingData?.travelers?.adults > 0) parts.push(`${bookingData?.travelers?.adults} Adult${bookingData?.travelers?.adults > 1 ? "s" : ""}`)
    if (bookingData?.travelers?.children > 0) parts.push(`${bookingData?.travelers?.children} Child${bookingData?.travelers?.children > 1 ? "ren" : ""}`)
    if (bookingData?.travelers?.infants > 0) parts.push(`${bookingData?.travelers?.infants} Infant${bookingData?.travelers?.infants > 1 ? "s" : ""}`)
    return parts.join(", ") || "No travelers"
  }

  const getEndDate = () => {
    if (!bookingData.startDate) return undefined
    const endDate = new Date(bookingData?.startDate)
    const duration = tripData?.duration || 8
    endDate.setDate(endDate.getDate() + duration)    
    return endDate
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            TRAVEL PERIOD
          </Badge>
          <div className="text-sm text-gray-600">
            <div>Arrival: {formatDate(bookingData?.startDate)}</div>
            <div>Departure: {formatDate(getEndDate())}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <BookingSideBarpoints label={tripData?.name} heading="Tour" />
          <BookingSideBarpoints label={getAccommodationName()} heading="Accommodation" />
          <BookingSideBarpoints label={getTravelerText()} heading="Travelers" />
          <BookingSideBarpoints label={getVehicleName()} heading="Vehicle" />

          {bookingData.selectedActivities.length > 0 && (
            <BookingSideBarpoints label={`${bookingData.selectedActivities.length} selected`} heading="Activities" />
          )}

          {(bookingData?.extraNights?.before > 0 || bookingData?.extraNights?.after > 0) && (
            <div className="text-sm">
              <div className="font-medium">Extra Nights</div>
              <div className="text-gray-600">
                {bookingData?.extraNights?.before > 0 && `${bookingData?.extraNights?.before} before`}
                {bookingData?.extraNights?.before > 0 && bookingData.extraNights?.after > 0 && ", "}
                {bookingData?.extraNights?.after > 0 && `${bookingData?.extraNights?.after} after`}
              </div>
            </div>
          )}
        </div>

        <div className={`${pricing?.breakdown && "border-t"} pt-4 space-y-2`}>
          {pricing?.breakdown && (
            <>
              <div className="flex justify-between text-sm">
                <span>Base Tour ({getTravelerText()})</span>
                <span>{formatPrice(tripData?.price || 0)}</span>
              </div>

              {pricing?.vehicleTotal && (
                <div className="flex justify-between text-sm">
                  <span>Vehicle : {formatPrice(pricing?.vehicleTotal)}</span>
                </div>
              )}

              {pricing?.activitiesTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Activities ({bookingData.selectedActivities.length})</span>
                  <span>{formatPrice(pricing?.activitiesTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(pricing?.subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (24%)</span>
                <span>{formatPrice(pricing?.taxes)}</span>
              </div>
            </>
          ) }

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-teal-600">{formatPrice(pricing?.total) || tripData?.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
