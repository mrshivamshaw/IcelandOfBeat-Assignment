"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BookingData } from "@/types/types"
import StepNav from "../../common/StepNav"

interface Step2Props {
  bookingData: BookingData
  updateBookingData: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step2TravelerDetails({ bookingData, updateBookingData, onNext, onPrev }: Step2Props) {
  const handleCustomerInfoChange = (field: string, value: string) => {
    updateBookingData({
      customerInfo: {
        ...bookingData?.customerInfo,
        [field]: value,
      },
    })
  }

  const handleAddressChange = (field: string, value: string) => {
    updateBookingData({
      customerInfo: {
        ...bookingData?.customerInfo,
        address: {
          ...bookingData?.customerInfo?.address,
          [field]: value,
        },
      },
    })
  }

  const handleTravelerDetailChange = (travelerIndex: number, field: string, value: string) => {
    const currentTravelerDetails = bookingData?.travelerDetails || []
    const updatedTravelerDetails = [...currentTravelerDetails]

    if (!updatedTravelerDetails[travelerIndex]) {
      updatedTravelerDetails[travelerIndex] = {
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        countryOfResidence: "",
        type: "adult",
      }
    }

    updatedTravelerDetails[travelerIndex] = {
      ...updatedTravelerDetails[travelerIndex],
      [field]: value,
    }

    updateBookingData({
      travelerDetails: updatedTravelerDetails,
    })
  }

  const handleContinue = () => {
    const { firstName, lastName, email } = bookingData?.customerInfo || {}
    if (firstName && lastName && email) {
      onNext()
    }
  }

    const isCustomerInfoValid = 
      bookingData?.customerInfo?.firstName?.trim() &&
      bookingData?.customerInfo?.lastName?.trim() &&
      bookingData?.customerInfo?.email?.trim()

    const areTravelersValid = (bookingData?.travelerDetails || []).every((traveler, idx) => {
      if (!traveler) return false
      const { firstName, lastName, dateOfBirth, countryOfResidence } = traveler

      const isAdult = idx < (bookingData?.travelers?.adults || 0)

      if (isAdult) {
        return firstName?.trim() && lastName?.trim() && dateOfBirth?.toString()?.trim() && countryOfResidence?.trim()
      }
      return firstName?.trim() && lastName?.trim() && dateOfBirth?.toString()?.trim()
    })

    const canContinue = Boolean(isCustomerInfoValid && areTravelersValid)
  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">TRAVELERS DETAILS</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">PRIMARY CUSTOMER DETAILS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name*</Label>
              <Input
                id="firstName"
                value={bookingData?.customerInfo?.firstName || ""}
                onChange={(e) => handleCustomerInfoChange("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name*</Label>
              <Input
                id="lastName"
                value={bookingData?.customerInfo?.lastName || ""}
                onChange={(e) => handleCustomerInfoChange("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={bookingData?.customerInfo?.email || ""}
                onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={bookingData?.customerInfo?.phone || ""}
                onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="street">Address line 1</Label>
            <Input
              id="street"
              value={bookingData?.customerInfo?.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Street address"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={bookingData?.customerInfo?.address?.city || ""}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={bookingData?.customerInfo?.address?.country || ""}
                onValueChange={(value) => handleAddressChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={bookingData?.customerInfo?.address?.zipCode || ""}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                placeholder="Zip Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details of All Travelers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">DETAILS OF ALL TRAVELERS</CardTitle>
          <p className="text-sm text-gray-600">
            Please provide passport information for all travelers.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adults */}
          {Array.from({ length: bookingData?.travelers?.adults || 0 }, (_, i) => (
            <div key={`adult-${i}`} className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Traveler {i + 1} - Adult</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Title</Label>
                  <Select
                    onValueChange={(value) => handleTravelerDetailChange(i, "title", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mr." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr.</SelectItem>
                      <SelectItem value="Mrs">Mrs.</SelectItem>
                      <SelectItem value="Ms">Ms.</SelectItem>
                      <SelectItem value="Dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>First Name*</Label>
                  <Input
                    placeholder="First Name"
                    onChange={(e) => handleTravelerDetailChange(i, "firstName", e.target.value)}
                    value={bookingData?.travelerDetails?.[i]?.firstName || ""}
                  />
                </div>
                <div>
                  <Label>Last Name*</Label>
                  <Input
                    placeholder="Last Name"
                    onChange={(e) => handleTravelerDetailChange(i, "lastName", e.target.value)}
                    value={bookingData?.travelerDetails?.[i]?.lastName || ""}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Date of Birth*</Label>
                  <Input
                    type="date"
                    onChange={(e) => handleTravelerDetailChange(i, "dateOfBirth", e.target.value)}
                    value={bookingData?.travelerDetails?.[i]?.dateOfBirth?.toString() || ""}
                  />
                </div>
                <div>
                  <Label>Passport Number</Label>
                  <Input
                    placeholder="Passport Number"
                    onChange={(e) => handleTravelerDetailChange(i, "passportNumber", e.target.value)}
                    value={bookingData?.travelerDetails?.[i]?.passportNumber || ""}
                  />
                </div>
                <div>
                  <Label>Country of Residence*</Label>
                  <Select onValueChange={(value) => handleTravelerDetailChange(i, "countryOfResidence", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {/* Children */}
          {Array.from({ length: bookingData?.travelers?.children || 0 }, (_, i) => {
            const childIndex = (bookingData?.travelers?.adults || 0) + i
            return (
              <div key={`child-${i}`} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Traveler {childIndex + 1} - Child</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>First Name*</Label>
                    <Input
                      placeholder="First Name"
                      onChange={(e) => handleTravelerDetailChange(childIndex, "firstName", e.target.value)}
                      value={bookingData?.travelerDetails?.[childIndex]?.firstName || ""}
                    />
                  </div>
                  <div>
                    <Label>Last Name*</Label>
                    <Input
                      placeholder="Last Name"
                      onChange={(e) => handleTravelerDetailChange(childIndex, "lastName", e.target.value)}
                      value={bookingData?.travelerDetails?.[childIndex]?.lastName || ""}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth*</Label>
                    <Input
                      type="date"
                      onChange={(e) => handleTravelerDetailChange(childIndex, "dateOfBirth", e.target.value)}
                      value={bookingData?.travelerDetails?.[childIndex]?.dateOfBirth.toString() || ""}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Infants */}
          {Array.from({ length: bookingData?.travelers?.infants || 0 }, (_, i) => {
            const infantIndex = (bookingData?.travelers?.adults || 0) + (bookingData?.travelers?.children || 0) + i
            return (
              <div key={`infant-${i}`} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Traveler {infantIndex + 1} - Infant</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>First Name*</Label>
                    <Input
                      placeholder="First Name"
                      onChange={(e) => handleTravelerDetailChange(infantIndex, "firstName", e.target.value)}
                      value={bookingData?.travelerDetails?.[infantIndex]?.firstName || ""}
                    />
                  </div>
                  <div>
                    <Label>Last Name*</Label>
                    <Input
                      placeholder="Last Name"
                      onChange={(e) => handleTravelerDetailChange(infantIndex, "lastName", e.target.value)}
                      value={bookingData?.travelerDetails?.[infantIndex]?.lastName || ""}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth*</Label>
                    <Input
                      type="date"
                      onChange={(e) => handleTravelerDetailChange(infantIndex, "dateOfBirth", e.target.value)}
                      value={bookingData?.travelerDetails?.[infantIndex]?.dateOfBirth.toString() || ""}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <StepNav onPrev={onPrev} canContinue={canContinue} onNext={handleContinue} />
    </div>
  )
}