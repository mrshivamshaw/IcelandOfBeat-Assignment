"use client"

import { useState } from "react"
import { useAdminAccommodations, useCreateAccommodation, useUpdateAccommodation } from "../../hooks/useAccommodations"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Plus, Search, Edit, Eye, Users } from "lucide-react"
import EntityFormModal from "../../components/common/EntityFormModal"
import type { FieldConfig } from "@/types/types"

export default function AdminAccommodations() {
  const { data: accommodations, isLoading } = useAdminAccommodations()
  const createAccommodation = useCreateAccommodation()
  const updateAccommodation = useUpdateAccommodation()
  const [searchTerm, setSearchTerm] = useState("")
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    initialData?: any
  }>({ isOpen: false, mode: "create" })

  const accommodationFields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "standard", label: "Standard" },
        { value: "comfort", label: "Comfort" },
        { value: "luxury", label: "Luxury" },
      ],
      required: true,
    },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "maxOccupancy", label: "Max Occupancy", type: "number", required: true },
    {
      name: "isActive",
      label: "Status",
      type: "boolean",
      options: [
        { value: true, label: "Active" },
        { value: false, label: " Inactive" },
      ],
    },
  ]

  const filteredAccommodations = accommodations?.filter((accommodation: any) =>
    accommodation.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (file) {
      formData.append("image", file)
    }
    await createAccommodation.mutateAsync(formData)
  }

  const handleEditSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (file) {
      formData.append("image", file)
    }
    await updateAccommodation.mutateAsync({ id: modalConfig.initialData._id, data: formData })
  }

  const openModal = (mode: "create" | "edit" | "view", initialData?: any) => {
    setModalConfig({ isOpen: true, mode, initialData })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Accommodation Management</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Accommodation Management</h1>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Accommodation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations?.map((accommodation: any) => (
          <Card key={accommodation._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                <Badge variant={accommodation.isActive ? "default" : "secondary"}>
                  {accommodation.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {accommodation.image && (
                <img src={accommodation.image} alt={accommodation.name} className="w-full h-40 object-cover rounded mb-4" />
              )}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{accommodation.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  Max {accommodation.maxOccupancy} guests
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  Type: {accommodation.type}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">{accommodation.name}</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openModal("view", accommodation)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openModal("edit", accommodation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccommodations?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accommodations found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search." : "Get started by creating your first accommodation."}
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Accommodation
          </Button>
        </div>
      )}

      <EntityFormModal
        isOpen={modalConfig.isOpen}
        onOpenChange={(open) => setModalConfig((prev) => ({ ...prev, isOpen: open }))}
        mode={modalConfig.mode}
        entityName="Accommodation"
        fields={accommodationFields as FieldConfig[]}
        initialData={modalConfig.initialData}
        onSubmit={modalConfig.mode === "create" ? handleAddSubmit : handleEditSubmit}
        isSubmitting={modalConfig.mode === "create" ? createAccommodation.isPending : modalConfig.mode === "edit" ? updateAccommodation.isPending : false}
      />
    </div>
  )
}