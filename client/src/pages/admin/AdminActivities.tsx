"use client"

import { useState } from "react"
import { useAdminActivities } from "../../hooks/useActivities"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Plus, Search, Edit, Eye, Clock, Users } from "lucide-react"
import { Activity } from "lucide-react" // Declare the Activity variable

export default function AdminActivities() {
    const { data: activities, isLoading } = useAdminActivities()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const categories = ["all", "adventure", "cultural", "nature", "relaxation", "sightseeing"]

    const filteredActivities = activities?.filter((activity: any) => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
        return matchesSearch && matchesCategory
    })

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
                <Button className="bg-teal-600 hover:bg-teal-700">
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
                            {category}
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
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{activity.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {activity.duration} hours
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users className="h-4 w-4 mr-2" />
                                    Up to {activity.maxParticipants} participants
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
                                        ${(activity.basePrice / 100).toLocaleString()}
                                    </span>
                                    {activity.perPersonPrice > 0 && (
                                        <span className="text-sm text-gray-500 ml-1">
                                            + ${(activity.perPersonPrice / 100).toLocaleString()}/person
                                        </span>
                                    )}
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

            {filteredActivities?.length === 0 && (
                <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== "all"
                            ? "Try adjusting your search or filters."
                            : "Get started by creating your first activity."}
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Activity
                    </Button>
                </div>
            )}
        </div>
    )
}
