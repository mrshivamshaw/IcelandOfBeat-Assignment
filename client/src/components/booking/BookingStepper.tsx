"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { bookingsApi, pricingApi } from "../../services/api"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Check } from "lucide-react"
import Step1TourSelection from "./steps/Step1TourSelection/Step1TourSelection"
import Step2TravelerDetails from "./steps/Step2TravelerDetails/Step2TravelerDetails"
import Step3OptionalActivities from "./steps/Step3OptionalActivities/Step3OptionalActivities"
import Step5Payment from "./steps/Step5Payment/Step5Payment"
import Step6Confirmation from "./steps/Step6Confirmation/Step6Confirmation"
import BookingSidebar from "./BookingSidebar"
import type { BookingData, Pricing, Trip } from "@/types/types"

interface BookingStepperProps {
  trip: Trip
}

export default function BookingStepper({ trip }: BookingStepperProps) {

  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    tripId: trip._id,
    startDate: "",
    travelers: { adults: 2, children: 0, infants: 0 },
    selectedAccommodation: "",
    selectedVehicle: "",
    selectedActivities: [],
    extraNights: { before: 0, after: 0 },
    additionalServices: [],
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        country: "",
        zipCode: "",
      },
    },
    totalPrice: 0, 
    travelerDetails: [
      { firstName: "", lastName: "", dateOfBirth: new Date(), countryOfResidence: "", type: "adult" },
    ], 
  });

  const [pricing, setPricing] = useState<Pricing>(
    { subtotal: 0, taxes: 0, total: 0, breakdown: [], accommodationTotal: 0, vehicleTotal: 0, activitiesTotal: 0,  }
  )

  const steps = [
    { number: 1, title: "Tour Selection", component: Step1TourSelection },
    { number: 2, title: "Traveler Details", component: Step2TravelerDetails },
    { number: 3, title: "Optional Activities", component: Step3OptionalActivities },
    { number: 4, title: "Payment", component: Step5Payment },
    { number: 5, title: "Confirmation", component: Step6Confirmation },
  ]

  const pricingMutation = useMutation({
    mutationFn: pricingApi.calculate,
    onSuccess: (data: any) => {
      setPricing(data)
    },
  })

  const bookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      setCurrentStep(6)
    },
  })

  const updateBookingData = (updates: any) => {
    const newData = { ...bookingData, ...updates }
    setBookingData(newData)

    // Recalculate pricing if relevant fields changed
    if (
      updates.startDate ||
      updates.travelers ||
      updates.selectedAccommodation ||
      updates.selectedVehicle ||
      updates.selectedActivities ||
      updates.extraNights
    ) {
      pricingMutation.mutate({
        startDate: newData.startDate,
        travelers: newData.travelers,
        selectedAccommodation: newData.selectedAccommodation,
        selectedVehicle: newData.selectedVehicle,
        selectedActivities: newData.selectedActivities,
        extraNights: newData.extraNights,
        duration: trip.duration,
        tripId: trip._id,
      })
    }
    console.log(newData);

  }

  const getAccommodationName = () => {
    if (!trip?.accommodations) return "Not selected"
    const accommodation = trip.accommodations.find(
      (acc: any) => acc._id == bookingData.selectedAccommodation || acc.id == bookingData.selectedAccommodation
    )

    return accommodation?.name || "Not selected"
  }

  const getVehicleName = () => {
    if (!trip?.vehicles) return "Not selected"
    const vehicle = trip.vehicles.find((veh: any) => veh._id === bookingData.selectedVehicle)
    return vehicle?.name || "Not selected"
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitBooking = () => {
    if (pricing) {
      bookingMutation.mutate({
        ...bookingData,
        pricing,
      })
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
              <div className="flex items-center mt-2">
                <Badge className="bg-orange-500 text-white mr-2">Best Seller</Badge>
                <span className="text-gray-600">Winter Wonder Along the Ring Road</span>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep > step.number
                        ? "bg-teal-600 text-white"
                        : currentStep === step.number
                          ? "bg-teal-100 text-teal-600 border-2 border-teal-600"
                          : "bg-gray-200 text-gray-500"
                      }
                  `}
                  >
                    {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${currentStep > step.number ? "bg-teal-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <CurrentStepComponent
                  trip={trip}
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  onNext={nextStep}
                  onPrev={prevStep}
                  getAccommodationName={getAccommodationName}
                  getVehicleName={getVehicleName}
                  submitBooking={submitBooking}
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar
              tripData={trip}
              bookingData={bookingData}
              pricing={pricing}
              getAccommodationName={getAccommodationName}
              getVehicleName={getVehicleName}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
