"use client"

import { useState } from "react"
import { useAdminTrips, useCreateTrip, useUpdateTrip, useAdminAccommodations, useAdminVehicles, useAdminActivities } from "../../hooks/useTrips"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Plus, Search, Edit, Eye, Users, Clock, MapPin } from "lucide-react"
import EntityFormModal from "../../components/common/EntityFormModal"

export default function AdminTrips() {
    const { data: trips, isLoading: isTripsLoading } = useAdminTrips()
    const { data: accommodations, isLoading: isAccommodationsLoading } = useAdminAccommodations()
    const { data: vehicles, isLoading: isVehiclesLoading } = useAdminVehicles()
    const { data: activities, isLoading: isActivitiesLoading } = useAdminActivities()
    const createTrip = useCreateTrip()
    const updateTrip = useUpdateTrip()
    const [searchTerm, setSearchTerm] = useState("")
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean
        mode: "create" | "edit" | "view"
        initialData?: any
    }>({ isOpen: false, mode: "create" })

    const tripFields = [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "dayDuration", label: "Day Duration", type: "number", required: true },
        { name: "nightDuration", label: "Night Duration", type: "number", required: true },
        { name: "duration", label: "Total Duration (days)", type: "number", required: true },
        {
            name: "price",
            label: "Price ($)",
            type: "number",
            required: true,
            transform: {
                toApi: (value: string) => Number(value) * 100,
                fromApi: (value: number) => (value / 100).toString(),
            },
        },
        {
            name: "accommodations",
            label: "Accommodations",
            type: "select",
            options: accommodations?.map((acc: any) => ({ value: acc._id, label: acc.name })) || [],
            required: false,
        },
        {
            name: "vehicles",
            label: "Vehicles",
            type: "select",
            options: vehicles?.map((veh: any) => ({ value: veh._id, label: veh.name })) || [],
            required: false,
        },
        {
            name: "dayActivities",
            label: "Activities Per Day",
            type: "dayActivities",
            options: activities?.map((act: any) => ({ value: act._id, label: act.name })) || [],
            required: false,
        },
        {
            name: "tags",
            label: "Tags (comma-separated)",
            type: "textarea",
            required: false,
            transform: {
                toApi: (value: string) => value.split(",").map((item: string) => item.trim()).filter(Boolean),
                fromApi: (value: string[]) => value.join(", "),
            },
        },
        {
            name: "isActive",
            label: "Status",
            type: "boolean",
            options: [
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
            ],
        },
        {
            name: "image",
            label: "Image",
            type: "image",
            required: false,
        },
    ]

    const filteredTrips = trips?.filter((trip: any) =>
        trip.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddSubmit = async (data: Record<string, any>, file?: File) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value.toString())
            }
        })
        if (file) {
            formData.append("image", file)
        }
        await createTrip.mutateAsync(formData)
    }

    const handleEditSubmit = async (data: Record<string, any>, file?: File) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value.toString())
            }
        })
        if (file) {
            formData.append("image", file)
        }
        await updateTrip.mutateAsync({ id: modalConfig.initialData._id, data: formData })
    }

    const openModal = (mode: "create" | "edit" | "view", initialData?: any) => {
        setModalConfig({ isOpen: true, mode, initialData })
    }

    if (isTripsLoading || isAccommodationsLoading || isVehiclesLoading || isActivitiesLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Trip
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search trips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips?.map((trip: any) => (
                    <Card key={trip._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{trip.name}</CardTitle>
                                <Badge variant={trip.isActive ? "default" : "secondary"}>
                                    {trip.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {trip.image && (
                                <img src={trip.image} alt={trip.name} className="w-full h-40 object-cover rounded mb-4" />
                            )}
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
                                <div className="text-sm text-gray-500">
                                    Tags: {trip.tags?.join(", ") || "None"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">
                                    ${(trip.price / 100).toLocaleString()}
                                </span>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => openModal("view", trip)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => openModal("edit", trip)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTrips?.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? "Try adjusting your search." : "Get started by creating your first trip."}
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Trip
                    </Button>
                </div>
            )}

            <EntityFormModal
                isOpen={modalConfig.isOpen}
                onOpenChange={(open) => setModalConfig((prev) => ({ ...prev, isOpen: open }))}
                mode={modalConfig.mode}
                entityName="Trip"
                fields={tripFields}
                initialData={modalConfig.initialData}
                onSubmit={modalConfig.mode === "create" ? handleAddSubmit : handleEditSubmit}
                isSubmitting={modalConfig.mode === "create" ? createTrip.isLoading : updateTrip.isLoading}
            />
        </div>
    )
}