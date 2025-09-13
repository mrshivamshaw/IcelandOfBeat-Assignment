"use client"

import { useState } from "react"
import { useAdminVehicles, useCreateVehicle, useUpdateVehicle } from "../../hooks/useVehicles"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Plus, Search, Edit, Eye, Users, DoorClosed, Briefcase } from "lucide-react"
import EntityFormModal from "../../components/common/EntityFormModal"
import type { FieldConfig } from "@/types/types"

export default function AdminVehicles() {
  const { data: vehicles, isLoading } = useAdminVehicles()
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()
  const [searchTerm, setSearchTerm] = useState("")
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    initialData?: any
  }>({ isOpen: false, mode: "create" })

  const vehicleFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "carModel", label: "Car Model", type: "text", required: true },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "suv", label: "SUV" },
        { value: "sedan", label: "Sedan" },
        { value: "van", label: "Van" },
        { value: "truck", label: "Truck" },
      ],
      required: true,
    },
    { name: "noPassengers", label: "Number of Passengers", type: "number", required: true },
    { name: "noDoors", label: "Number of Doors", type: "number", required: true },
    { name: "noSuitcases", label: "Number of Suitcases", type: "number", required: true },
    {
      name: "transmission",
      label: "Transmission",
      type: "select",
      options: [
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" },
      ],
      required: true,
    },
    {
      name: "features",
      label: "Features (comma-separated)",
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

  const filteredVehicles = vehicles?.filter((vehicle: any) =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "features" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value.toString())
      }
    })
    if (file) {
      formData.append("image", file)
    }
    await createVehicle.mutateAsync(formData)
  }

  const handleEditSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "features" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value.toString())
      }
    })
    if (file) {
      formData.append("image", file)
    }
    await updateVehicle.mutateAsync({ id: modalConfig.initialData._id, data: formData })
  }

  const openModal = (mode: "create" | "edit" | "view", initialData?: any) => {
    setModalConfig({ isOpen: true, mode, initialData })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles?.map((vehicle: any) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                  {vehicle.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {vehicle.image && (
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover rounded mb-4" />
              )}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {vehicle.noPassengers} passengers
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DoorClosed className="h-4 w-4 mr-2" />
                  {vehicle.noDoors} doors
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {vehicle.noSuitcases} suitcases
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  Type: {vehicle.type}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  Transmission: {vehicle.transmission}
                </div>
                <div className="text-sm text-gray-500">
                  Features: {vehicle.features.join(", ")}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">{vehicle.carModel}</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openModal("view", vehicle)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openModal("edit", vehicle)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles?.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search." : "Get started by creating your first vehicle."}
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      )}

      <EntityFormModal
        isOpen={modalConfig.isOpen}
        onOpenChange={(open) => setModalConfig((prev) => ({ ...prev, isOpen: open }))}
        mode={modalConfig.mode}
        entityName="Vehicle"
        fields={vehicleFields as FieldConfig[]}
        initialData={modalConfig.initialData}
        onSubmit={modalConfig.mode === "create" ? handleAddSubmit : modalConfig.mode === "edit" ? handleEditSubmit : undefined}
        isSubmitting={modalConfig.mode === "create" ? createVehicle.isPending : modalConfig.mode === "edit" ? updateVehicle.isPending : false}
      />
    </div>
  )
}