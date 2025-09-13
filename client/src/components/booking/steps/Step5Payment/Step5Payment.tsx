"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock } from "lucide-react"
import type { BookingData } from "@/types/types"
import StepNav from "../../common/StepNav"

interface Step5Props {
  bookingData: BookingData
  updateBookingData: (data: any) => void
  onNext: () => void
  onPrev: () => void
  submitBooking: () => void
}

export default function Step5Payment({ bookingData, updateBookingData, onNext, onPrev, submitBooking }: Step5Props) {
  const handlePayment = () => {
    setTimeout(() => {
      submitBooking()
      onNext()
    }, 2000)
  }

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">SECURE PAYMENT</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            PAYMENT METHOD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="credit-card"
                name="payment-method"
                value="credit-card"
                defaultChecked
                onChange={(e) => updateBookingData({ paymentMethod: e.target.value })}
              />
              <label htmlFor="credit-card" className="font-medium">
                Credit/Debit Card
              </label>
              <div className="flex gap-2 ml-auto">
                <img src="/placeholder.svg?height=24&width=38" alt="Visa" className="h-6" />
                <img src="/placeholder.svg?height=24&width=38" alt="Mastercard" className="h-6" />
                <img src="/placeholder.svg?height=24&width=38" alt="Amex" className="h-6" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="card-number">Card Number*</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div>
              <Label htmlFor="cardholder-name">Cardholder Name*</Label>
              <Input id="cardholder-name" placeholder="John Doe" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiry-month">Expiry Month*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiry-year">Expiry Year*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cvv">CVV*</Label>
              <Input id="cvv" placeholder="123" maxLength={4} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="save-card" />
              <Label htmlFor="save-card" className="text-sm">
                Save this card for future bookings
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms-payment" />
              <Label htmlFor="terms-payment" className="text-sm">
                I agree to the <span className="text-blue-600 underline">Terms and Conditions</span> and{" "}
                <span className="text-blue-600 underline">Privacy Policy</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing" className="text-sm">
                I would like to receive marketing communications from Nordic Visitor
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">BILLING ADDRESS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="same-as-traveler" defaultChecked />
            <Label htmlFor="same-as-traveler" className="text-sm">
              Same as traveler address
            </Label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing-first-name">First Name*</Label>
              <Input id="billing-first-name" value={bookingData.customerInfo.firstName} disabled />
            </div>
            <div>
              <Label htmlFor="billing-last-name">Last Name*</Label>
              <Input id="billing-last-name" value={bookingData.customerInfo.lastName} disabled />
            </div>
          </div>

          <div>
            <Label htmlFor="billing-address">Address*</Label>
            <Input id="billing-address" value={bookingData?.customerInfo?.address?.street} disabled />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing-city">City*</Label>
              <Input id="billing-city" value={bookingData?.customerInfo?.address?.city} disabled />
            </div>
            <div>
              <Label htmlFor="billing-country">Country*</Label>
              <Input id="billing-country" value={bookingData?.customerInfo?.address?.country} disabled />
            </div>
          </div>
        </CardContent>
      </Card>


        <StepNav onPrev={onPrev} canContinue={true} onNext={handlePayment} />

    </div>
  )
}
