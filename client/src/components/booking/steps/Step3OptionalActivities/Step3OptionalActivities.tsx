"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery, type QueryObserverResult } from "@tanstack/react-query"
import { activitiesApi } from "@/services/api"
import paceholder from "../../../../assets/react.svg"
import type { Activity, BookingData } from "@/types/types"
import StepNav from "../../common/StepNav"

interface Step3Props {
    bookingData: BookingData
    updateBookingData: (data: any) => void
    onNext: () => void
    onPrev: () => void
}

export default function BookingStep3({ bookingData, updateBookingData, onNext, onPrev }: Step3Props) {
    const {
        data: activities,
        isLoading,
        error,
    }: QueryObserverResult<Activity[], unknown> = useQuery({
        queryKey: ["activities"],
        queryFn: activitiesApi.getAll,
    })

    const toggleActivity = (activityId: string) => {
        const currentActivities = bookingData?.selectedActivities || []
        const isSelected = currentActivities.includes(activityId)

        if (isSelected) {
            updateBookingData({
                selectedActivities: currentActivities.filter((_id: string) => _id !== activityId),
            })
        } else {
            updateBookingData({
                selectedActivities: [...currentActivities, activityId],
            })
        }
    }

    // Fixed: Added proper null/undefined checks and fallback
    const groupedActivities = activities?.reduce(
        (acc, activity) => {
            if (!acc[activity.category]) {
                acc[activity.category] = []
            }
            acc[activity.category].push(activity)
            return acc
        },
        {} as Record<string, typeof activities>,
    ) || {} // Fallback to empty object

    // Loading state
    if (isLoading) {
        return (
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">OPTIONAL ACTIVITIES</h2>
                        <p className="text-gray-600">
                            Loading activities...
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">OPTIONAL ACTIVITIES</h2>
                        <p className="text-red-600">
                            Error loading activities. Please try again.
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={onPrev}>
                            GO BACK
                        </Button>
                        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                            SKIP & CONTINUE
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // No activities available
    if (!activities || activities.length === 0) {
        return (
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">OPTIONAL ACTIVITIES</h2>
                        <p className="text-gray-600">
                            No activities available at the moment.
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={onPrev}>
                            GO BACK
                        </Button>
                        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                            CONTINUE
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:col-span-2 space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">OPTIONAL ACTIVITIES</h2>
            </div>

            {groupedActivities && Object.keys(groupedActivities).length > 0 ? (
                Object.entries(groupedActivities).map(([category, categoryActivities]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-600">
                                {category.toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-gray-600">All recommended tours</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryActivities?.map((activity) => {
                                    const isSelected = bookingData?.selectedActivities?.includes(activity._id) || false

                                    return (
                                        <div key={activity._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                src={paceholder}
                                                alt={activity?.name}
                                                className="w-full h-32 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder.svg"
                                                }}
                                            />
                                            <div className="p-3">
                                                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                                    {activity?.name}
                                                </h3>
                                                <div className="text-xs text-gray-600 mb-2">
                                                    <div>Duration : {activity?.duration || 'Duration not specified'}hr</div>
                                                </div>
                                                <div className="flex justify-between gap-2 mb-3">
                                                    <span className="font-bold text-green-600">
                                                        {activity?.perPersonPrice ? `$${activity?.perPersonPrice}` : 'Price on request'}
                                                    </span>
                                                    <span>{activity?.location || 'Location not specified'}</span>
                                                </div>
                                                <Button
                                                    variant={isSelected ? "default" : "outline"}
                                                    size="sm"
                                                    className={`w-full ${isSelected ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                                                    onClick={() => toggleActivity(activity._id)}
                                                >
                                                    {isSelected ? "REMOVE" : "ADD"}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-600">No activities available in any category.</p>
                </div>
            )}

            <StepNav onPrev={onPrev} onNext={onNext} canContinue={true} />

        </div>

    )
}