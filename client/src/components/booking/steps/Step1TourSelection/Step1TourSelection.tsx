"use client"

import { Button } from "../../../ui/button"
import { Card, CardContent } from "../../../ui/card"
import { Calendar, Users } from "lucide-react"
import { Input } from "../../../ui/input"
import StepHeader from "../../common/StepHeader"
import type { BookingData, Trip } from "@/types/types"
import TravellerCount from "./TravellerCount"
import NightCount from "./NightCount"
import StepNav from "../../common/StepNav"

interface Step1Props {
  trip: Trip
  bookingData: BookingData
  updateBookingData: (updates: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step1TourSelection({ trip, bookingData, updateBookingData, onNext, onPrev }: Step1Props) {

  const updateTravelers = (type: "adults" | "children" | "infants", change: number) => {
    const newTravelers = {
      ...bookingData.travelers,
      [type]: Math.max(0, bookingData.travelers[type] + change),
    }
    if (type === "adults" && newTravelers.adults < 1) {
      newTravelers.adults = 1
    }
    updateBookingData({ travelers: newTravelers })
  }

  const updateExtraNights = (type: "before" | "after", change: number) => {
    const newExtraNights = {
      ...bookingData.extraNights,
      [type]: Math.max(0, bookingData.extraNights[type] + change),
    }
    updateBookingData({ extraNights: newExtraNights })
  }


  const toDate = (d?: string | Date | null): Date | null => {
    if (!d) return null;
    if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  const isBetweenMonthDayInclusive = (date: Date, startMonth: number, startDay: number, endMonth: number, endDay: number) => {
    const val = (date.getMonth() + 1) * 100 + date.getDate();      
    const left = startMonth * 100 + startDay;                    
    const right = endMonth * 100 + endDay;                       
    return val >= left && val <= right;
  }

  const isHighSeason = (date: Date) => isBetweenMonthDayInclusive(date, 1, 1, 7, 31);

  const equalsId = (a: any, b: any) => String(a?._id ?? a) === String(b);

  const getAccommodationPrice = (accommodationId: string) => {
    const accommodation = trip.accommodations.find((acc: any) => equalsId(acc, accommodationId));
    if (!accommodation) return 0;

    const bookingStart = toDate(bookingData?.startDate);
    const high = bookingStart ? isHighSeason(bookingStart) : false;

    // prefer explicit seasonal price, fallback to generic `price` or 0
    return high
      ? (accommodation?.highPrice?.basePrice ?? accommodation?.price ?? 0)
      : (accommodation?.lowPrice?.basePrice ?? accommodation?.price ?? 0);
  }

  const getVehiclePrice = (vehicleId: string) => {
    const vehicle = trip.vehicles.find((veh: any) => equalsId(veh, vehicleId));
    if (!vehicle) return 0;

    const bookingStart = toDate(bookingData?.startDate);
    const high = bookingStart ? isHighSeason(bookingStart) : false;

    return high
      ? (vehicle?.highPrice?.basePrice ?? vehicle?.price ?? 0)
      : (vehicle?.lowPrice?.basePrice ?? vehicle?.price ?? 0);
  }


  const canContinue = bookingData.startDate && bookingData?.selectedAccommodation && bookingData?.selectedVehicle

  return (
    <div className="space-y-8">
      <StepHeader textString="Tour Selection" />
      {/* Tour Start Date */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Tour Start Date
        </h3>
        <p className="text-sm text-gray-600 mb-4">When would you like the adventure to begin?</p>
        <Input
          type="date"
          value={bookingData?.startDate?.toString() || ""}
          onChange={(e) => updateBookingData({ startDate: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
          className="max-w-xs"
        />
      </div>

      {/* How Many Travelers */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-teal-600" />
          How Many Travelers?
        </h3>
        <p className="text-sm text-gray-600 mb-4">Let us know a little about your travel party.</p>
        <div className="space-y-4">
          {/* Adults */}
          <TravellerCount label="Adults" type="adults" updateTravelers={updateTravelers} isDisabled={bookingData.travelers.adults <= 1} count={bookingData.travelers.adults} />

          {/* Children */}
          <TravellerCount label="Children (age 12-17)" type="children" updateTravelers={updateTravelers} isDisabled={bookingData.travelers.children <= 0} count={bookingData.travelers.children} />

          {/* Infants */}
          <TravellerCount label="Infants (under 2)" type="infants" updateTravelers={updateTravelers} isDisabled={bookingData.travelers.infants <= 0} count={bookingData.travelers.infants} />
        </div>
      </div>

      {/* Accommodation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Accommodation</h3>
        <p className="text-sm text-gray-600 mb-4">
          We need to make this trip just right. Select the accommodation type of your choice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trip.accommodations?.map((accommodation: any) => (
            <Card
              key={accommodation._id}
              className={`cursor-pointer transition-all ${bookingData?.selectedAccommodation === accommodation._id ? "ring-2 ring-teal-600 bg-teal-50" : "hover:shadow-md"
                }`}
              onClick={() => updateBookingData({ selectedAccommodation: accommodation._id })}
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-center mb-2">{accommodation.name.toUpperCase()}</h4>
                <p className="text-sm text-gray-600 text-center mb-4">{accommodation.description}</p>
                <div className="flex justify-between items-center">
                  <div>${getAccommodationPrice(accommodation._id)}</div>
                  <div className="text-center">
                    <Button
                      variant={bookingData?.selectedAccommodation === accommodation._id ? "default" : "outline"}
                      size="sm"
                      className={bookingData?.selectedAccommodation === accommodation._id ? "bg-gray-600" : ""}
                    >
                      SELECT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Extra Nights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Extra Nights</h3>
        <p className="text-sm text-gray-600 mb-4">
          Want more to enjoy? 2 nights and above will get you 10% off. Would you like to add extra nights to Reykjavik
          before or after your tour?
          <span className="text-red-600 ml-1">Details about extra nights.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Nights Before Tour */}
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Add Nights Before Tour</h4>
            <p className="text-sm text-gray-600 mb-4"> Arrive early and get comfortable with the time zone before your tour starts.</p>
            <NightCount isDisabled={bookingData.extraNights.before <= 0} updateExtraNights={updateExtraNights} type="before" count={bookingData.extraNights.before} />
          </Card>

          {/* Add Nights After Tour */}
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Add Nights After Tour</h4>
            <p className="text-sm text-gray-600 mb-4">Extend your stay and unwind after your tour ends.</p>
            <NightCount isDisabled={bookingData.extraNights.after <= 0} updateExtraNights={updateExtraNights} type="after" count={bookingData.extraNights.after} />
          </Card>
        </div>
      </div>

      {/* Choose Your Vehicle */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Your Vehicle</h3>
        <p className="text-sm text-gray-600 mb-4">
          A selection of vehicles has been chosen for this tour. The vehicle is yours for the entire trip.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trip.vehicles?.map((vehicle: any) => (
            <Card
              key={vehicle._id}
              className={`cursor-pointer transition-all ${bookingData?.selectedVehicle === vehicle._id ? "ring-2 ring-teal-600 bg-teal-50" : "hover:shadow-md"
                }`}
              onClick={() => updateBookingData({ selectedVehicle: vehicle._id })}
            >
              <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">{vehicle.name.toUpperCase()}</h4>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  {vehicle.capacity} passengers • {vehicle.transmission} • {vehicle.fuelType}
                </p>
                <div className="flex justify-between items-center">
                  <div>${getVehiclePrice(vehicle._id)}</div>
                  <Button
                    variant={bookingData?.selectedVehicle === vehicle._id ? "default" : "outline"}
                    size="sm"
                    className={bookingData?.selectedVehicle === vehicle._id ? "bg-gray-600" : ""}
                  >
                    SELECT
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <StepNav onPrev={onPrev} canContinue={canContinue} onNext={onNext} />
    </div>
  )
}
