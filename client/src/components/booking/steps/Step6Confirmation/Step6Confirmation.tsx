"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail, Calendar } from "lucide-react"

interface Step6Props {
  bookingData: any,
  getAccommodationName: () => string
  getVehicleName: () => string
}

export default function Step6Confirmation({ bookingData, getAccommodationName, getVehicleName, }: Step6Props) {
  const bookingReference = "NV" + Math.random().toString(36).substr(2, 8).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">BOOKING CONFIRMED!</h2>
        <p className="text-gray-600">Thank you for choosing Nordic Visitor. Your Iceland adventure awaits!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">BOOKING DETAILS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Booking Reference:</span>
              <span className="font-bold text-blue-600">{bookingReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tour:</span>
              <span>Iceland Full Circle Classic - Winter</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Start Date:</span>
              <span>{bookingData.startDate ? bookingData.startDate : "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Travelers:</span>
              <span>
                {bookingData?.travelers?.adults} Adults{bookingData?.travelers?.children > 0 ? `, ${bookingData?.travelers?.children} Children` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Accommodation:</span>
              <span className="capitalize">{getAccommodationName()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vehicle:</span>
              <span className="capitalize">{getVehicleName()}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid:</span>
              {/* <span className="text-green-600">€{bookingData.totalPrice.toLocaleString()}</span> */}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">WHAT HAPPENS NEXT?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Confirmation Email</h3>
                <p className="text-sm text-gray-600">You'll receive a detailed confirmation email within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Travel Documents</h3>
                <p className="text-sm text-gray-600">
                  Your complete travel itinerary will be sent 7 days before departure
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Pre-Departure Call</h3>
                <p className="text-sm text-gray-600">Our team will contact you 48 hours before your trip</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">NEED HELP?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-medium mb-2">24/7 Emergency Support</h3>
              <p className="text-sm text-gray-600">+354 578 2000</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">support@nordicvisitor.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Booking Reference</h3>
              <p className="text-sm text-gray-600 font-bold">{bookingReference}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">DOWNLOAD CONFIRMATION</Button>
      </div>
    </div>
  )
}
