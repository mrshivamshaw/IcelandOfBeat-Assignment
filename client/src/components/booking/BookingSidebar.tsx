"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BookingSidebarProps {
  bookingData: any
  tripData?: any
  onContinue?: () => void
  isLoading?: boolean
  showContinueButton?: boolean
}

export default function BookingSidebar({
  bookingData,
  tripData,
  onContinue,
  isLoading = false,
  showContinueButton = true,
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

  const getAccommodationName = () => {
    if (!tripData?.accommodations) return "Not selected"
  const accommodation = tripData.accommodations.find(
    (acc: any) => acc._id == bookingData.selectedAccommodation || acc.id == bookingData.selectedAccommodation
  )
    
    return accommodation?.name || "Not selected"
  }

  const getVehicleName = () => {
    if (!tripData?.vehicles) return "Not selected"
    const vehicle = tripData.vehicles.find((veh: any) => veh.id === bookingData.selectedVehicle)
    return vehicle?.name || "Not selected"
  }

  const getTravelerText = () => {
    const parts = []
    if (bookingData.adults > 0) parts.push(`${bookingData.adults} Adult${bookingData.adults > 1 ? "s" : ""}`)
    if (bookingData.children > 0) parts.push(`${bookingData.children} Child${bookingData.children > 1 ? "ren" : ""}`)
    if (bookingData.infants > 0) parts.push(`${bookingData.infants} Infant${bookingData.infants > 1 ? "s" : ""}`)
    return parts.join(", ") || "No travelers"
  }

  const getEndDate = () => {
    if (!bookingData.date) return undefined
    const endDate = new Date(bookingData.date)
    const duration = tripData?.trip?.duration || 8
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
          <div className="text-sm">
            <div className="font-medium">Tour</div>
            <div className="text-gray-600">{tripData?.trip?.name || "Iceland Full Circle Classic"}</div>
          </div>

          <div className="text-sm">
            <div className="font-medium">Accommodation</div>
            <div className="text-gray-600">{getAccommodationName()}</div>
          </div>

          <div className="text-sm">
            <div className="font-medium">Travelers</div>
            <div className="text-gray-600">{getTravelerText()}</div>
          </div>

          <div className="text-sm">
            <div className="font-medium">Vehicle</div>
            <div className="text-gray-600">{getVehicleName()}</div>
          </div>

          {bookingData.selectedActivities.length > 0 && (
            <div className="text-sm">
              <div className="font-medium">Activities</div>
              <div className="text-gray-600">{bookingData.selectedActivities.length} selected</div>
            </div>
          )}

          {(bookingData.extraNightsBefore > 0 || bookingData.extraNightsAfter > 0) && (
            <div className="text-sm">
              <div className="font-medium">Extra Nights</div>
              <div className="text-gray-600">
                {bookingData.extraNightsBefore > 0 && `${bookingData.extraNightsBefore} before`}
                {bookingData.extraNightsBefore > 0 && bookingData.extraNightsAfter > 0 && ", "}
                {bookingData.extraNightsAfter > 0 && `${bookingData.extraNightsAfter} after`}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calculating pricing...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
              </div>
            </div>
          ) : bookingData.pricingBreakdown ? (
            <>
              <div className="flex justify-between text-sm">
                <span>Base Tour ({getTravelerText()})</span>
                <span>{formatPrice(bookingData.pricingBreakdown.baseTripPrice)}</span>
              </div>

              {bookingData.pricingBreakdown.accommodation && (
                <div className="flex justify-between text-sm">
                  <span>Accommodation ({bookingData.pricingBreakdown.accommodation.nights} nights)</span>
                  <span>{formatPrice(bookingData.pricingBreakdown.accommodation.total)}</span>
                </div>
              )}

              {bookingData.pricingBreakdown.vehicle && (
                <div className="flex justify-between text-sm">
                  <span>Vehicle ({bookingData.pricingBreakdown.vehicle.days} days)</span>
                  <span>{formatPrice(bookingData.pricingBreakdown.vehicle.total)}</span>
                </div>
              )}

              {bookingData.pricingBreakdown.activities && bookingData.pricingBreakdown.activities.total > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Activities ({bookingData.selectedActivities.length})</span>
                  <span>{formatPrice(bookingData.pricingBreakdown.activities.total)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(bookingData.pricingBreakdown.subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (24%)</span>
                <span>{formatPrice(bookingData.pricingBreakdown.taxes)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span>{formatPrice(bookingData.totalPrice)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-teal-600">{formatPrice(bookingData?.totalPrice)}</span>
          </div>
        </div>

        {showContinueButton && (
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
            onClick={onContinue}
            disabled={isLoading}
          >
            {isLoading ? "CALCULATING..." : "CONTINUE BOOKING"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
