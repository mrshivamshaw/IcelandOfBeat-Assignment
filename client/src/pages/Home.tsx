import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { tripsApi } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Clock } from "lucide-react"

export default function HomePage() {
  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: tripsApi.getAll,
  }) as { data: any; isLoading: boolean }

  const img = "https://placehold.co/300x200/EEE/31343C?text=Hello+World"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing Iceland tours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Iceland's Magic</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience the land of fire and ice with our expertly crafted tours. From Northern Lights to glacial
              adventures, create memories that last a lifetime.
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Explore Tours
            </Button>
          </div>
        </div>
      </div>

      {/* Tours Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tours</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated selection of Iceland adventures, each designed to showcase the country's
            most spectacular sights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips?.map((trip: any) => (
            <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img className="w-full h-48 object-cover" src={img} alt="" />

              <CardHeader>
                <CardTitle className="text-xl font-bold">{trip.name}</CardTitle>
                <CardDescription className="text-gray-600">{trip.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {trip.duration} days
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${(trip.price).toLocaleString()}</span>
                  </div>
                  <Link to={`/booking/${trip._id}`}>
                    <Button className="bg-teal-600 hover:bg-teal-700">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
