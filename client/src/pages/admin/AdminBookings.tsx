"use client"

import { useState } from "react"
import { useAdminBookings } from "../../hooks/useBookings"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Calendar, Users, DollarSign, Eye, Edit } from "lucide-react"

export default function AdminBookings() {
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const { data: bookingsData, isLoading } = useAdminBookings({
        page,
        status: statusFilter !== "all" ? statusFilter : undefined,
    })

    const statuses = ["all", "pending", "confirmed", "cancelled", "completed"]

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "completed":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <div className="text-sm text-gray-500">{bookingsData?.pagination?.total || 0} total bookings</div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {statuses.map((status) => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {bookingsData?.bookings?.map((booking: any) => (
                    <Card key={booking._id}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="font-semibold text-lg">
                                            {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                                        </h3>
                                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                        <Badge variant="outline" className={getStatusColor(booking.paymentStatus)}>
                                            {booking.paymentStatus}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(booking.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2" />
                                            {booking.travelers.adults + booking.travelers.children} travelers
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2" />${(booking.pricing.total / 100).toLocaleString()}
                                        </div>
                                        <div>{booking.tripId?.name || "Unknown Trip"}</div>
                                    </div>
                                </div>

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

            {/* Pagination */}
            {bookingsData?.pagination && bookingsData.pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {page} of {bookingsData.pagination.pages}
                    </span>
                    <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page === bookingsData.pagination.pages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
