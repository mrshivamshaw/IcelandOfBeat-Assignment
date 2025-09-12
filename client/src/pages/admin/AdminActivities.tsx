"use client"

import { useState } from "react"
import { useAdminActivities, useCreateActivity, useUpdateActivity } from "../../hooks/useActivities"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Plus, Search, Edit, Eye, Clock } from "lucide-react"
import { Activity } from "lucide-react"
import EntityFormModal from "../../components/common/EntityFormModal"

export default function AdminActivities() {
  const { data: activities, isLoading } = useAdminActivities()
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    initialData?: any
  }>({ isOpen: false, mode: "create" })

  const categories = ["all", "adventure", "cultural", "nature", "relaxation", "sightseeing"]

  const activityFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categories.slice(1).map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
      required: true,
    },
    { name: "duration", label: "Duration (hours)", type: "number", required: true },
    {
      name: "perPersonPrice",
      label: "Per Person Price ($)",
      type: "number",
      required: true,
      transform: {
        toApi: (value: string) => Number(value) * 100,
        fromApi: (value: number) => (value / 100).toString(),
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

  const filteredActivities = activities?.filter((activity: any) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    activityFields.forEach((field) => {
      if (field.name in data && field.type !== "image") {
        const value = data[field.name]
        const transformedValue = field.transform?.toApi ? field.transform.toApi(value) : value        
        formData.append(field.name, transformedValue.toString())
      }
    })
    if (file) {
      formData.append("image", file)
    }
    await createActivity.mutateAsync(formData)
  }

  const handleEditSubmit = async (data: Record<string, any>, file?: File) => {
    const formData = new FormData()
    activityFields.forEach((field) => {
      if (field.name in data && field.type !== "image") {
        const value = data[field.name]
        const transformedValue = field.transform?.toApi ? field.transform.toApi(value) : value        
        formData.append(field.name, transformedValue.toString())
      }
    })
    if (file) {
      formData.append("image", file)
    }
    console.log("Updating activity with ID:", modalConfig.initialData._id, "Data:", Object.fromEntries(formData.entries()));
    
    await updateActivity.mutateAsync({ id: modalConfig.initialData._id, data: formData })
  }

  const openModal = (mode: "create" | "edit" | "view", initialData?: any) => {
    setModalConfig({ isOpen: true, mode, initialData })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Management</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Activity Management</h1>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities?.map((activity: any) => (
          <Card key={activity._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={activity.isActive ? "default" : "secondary"}>
                    {activity.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {activity.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activity.image && (
                <img src={activity.image} alt={activity.name} className="w-full h-40 object-cover rounded mb-4" />
              )}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{activity.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {activity.duration} hours
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Badge variant="outline" className="text-xs">
                    {activity.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ${(activity.perPersonPrice / 100)} <span className="text-sm">per person</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openModal("view", activity)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openModal("edit", activity)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities?.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by creating your first activity."}
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => openModal("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Activity
          </Button>
        </div>
      )}

      <EntityFormModal
        isOpen={modalConfig.isOpen}
        onOpenChange={(open) => setModalConfig((prev) => ({ ...prev, isOpen: open }))}
        mode={modalConfig.mode}
        entityName="Activity"
        fields={activityFields}
        initialData={modalConfig.initialData}
        onSubmit={modalConfig.mode === "create" ? handleAddSubmit : handleEditSubmit}
        isSubmitting={modalConfig.mode === "create" ? createActivity.isLoading : updateActivity.isLoading}
      />
    </div>
  )
}