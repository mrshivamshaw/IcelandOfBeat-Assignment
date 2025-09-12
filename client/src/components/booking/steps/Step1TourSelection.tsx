"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Calendar, Users, Minus, Plus } from "lucide-react"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

interface Step1Props {
  trip: any
  bookingData: any
  updateBookingData: (updates: any) => void
  onNext: () => void
}

export default function Step1TourSelection({ trip, bookingData, updateBookingData, onNext }: Step1Props) {
  const [selectedAccommodation, setSelectedAccommodation] = useState(bookingData.selectedAccommodation)
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.selectedVehicle)

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

  const handleContinue = () => {
    updateBookingData({
      selectedAccommodation,
      selectedVehicle,
    })
    onNext()
  }

  const canContinue = bookingData.startDate && selectedAccommodation && selectedVehicle

  return (
    <div className="space-y-8">
      {/* Tour Start Date */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Tour Start Date
        </h3>
        <p className="text-sm text-gray-600 mb-4">When would you like the adventure to begin?</p>
        <Input
          type="date"
          value={bookingData.startDate}
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
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Adults</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("adults", -1)}
                disabled={bookingData.travelers.adults <= 1}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{bookingData.travelers.adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("adults", 1)}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Children (age 2-11)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("children", -1)}
                disabled={bookingData.travelers.children <= 0}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{bookingData.travelers.children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("children", 1)}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Infants (under 2)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("infants", -1)}
                disabled={bookingData.travelers.infants <= 0}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{bookingData.travelers.infants}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTravelers("infants", 1)}
                className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
              className={`cursor-pointer transition-all ${
                selectedAccommodation === accommodation._id ? "ring-2 ring-teal-600 bg-teal-50" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedAccommodation(accommodation._id)}
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-center mb-2">{accommodation.name.toUpperCase()}</h4>
                <p className="text-sm text-gray-600 text-center mb-4">{accommodation.description}</p>
                <div className="text-center">
                  <Button
                    variant={selectedAccommodation === accommodation._id ? "default" : "outline"}
                    size="sm"
                    className={selectedAccommodation === accommodation._id ? "bg-gray-600" : ""}
                  >
                    SELECT
                  </Button>
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
            <p className="text-sm text-gray-600 mb-4">
              Arrive early and get comfortable with the time zone before your tour starts.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights("before", -1)}
                disabled={bookingData.extraNights.before <= 0}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center">
                <strong>{bookingData.extraNights.before}</strong> nights
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights("before", 1)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Add Nights After Tour */}
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Add Nights After Tour</h4>
            <p className="text-sm text-gray-600 mb-4">Extend your stay and unwind after your tour ends.</p>
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights("after", -1)}
                disabled={bookingData.extraNights.after <= 0}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center">
                <strong>{bookingData.extraNights.after}</strong> nights
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights("after", 1)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
              className={`cursor-pointer transition-all ${
                selectedVehicle === vehicle._id ? "ring-2 ring-teal-600 bg-teal-50" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedVehicle(vehicle._id)}
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
                <Button
                  variant={selectedVehicle === vehicle._id ? "default" : "outline"}
                  size="sm"
                  className={selectedVehicle === vehicle._id ? "bg-gray-600" : ""}
                >
                  SELECT
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!canContinue} className="bg-orange-500 hover:bg-orange-600">
          Continue Booking
        </Button>
      </div>
    </div>
  )
}
