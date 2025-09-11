"use client"

import { useState } from "react"
import { useAdminTrips } from "../../hooks/useTrips"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Plus, Edit, Eye, Users, Clock, MapPin } from "lucide-react"

export default function AdminTrips() {
    const { data: trips, isLoading } = useAdminTrips()
    const [selectedTrip, setSelectedTrip] = useState(null)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
                    <Button disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Trip
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Trip
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips?.map((trip: any) => (
                    <Card key={trip._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{trip.name}</CardTitle>
                                <Badge variant={trip.isActive ? "default" : "secondary"}>{trip.isActive ? "Active" : "Inactive"}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{trip.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {trip.duration} days
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users className="h-4 w-4 mr-2" />
                                    Up to {trip.maxParticipants} participants
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">${(trip.basePrice / 100).toLocaleString()}</span>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {trips?.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first trip.</p>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Trip
                    </Button>
                </div>
            )}
        </div>
    )
}
