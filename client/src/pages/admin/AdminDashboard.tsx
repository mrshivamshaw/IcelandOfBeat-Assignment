import { useAdminDashboard } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Calendar, MapPin, Activity, Car, TrendingUp, Clock } from "lucide-react"

export default function AdminDashboard() {
    const { data: stats, isLoading } = useAdminDashboard()

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const statCards = [
        {
            title: "Total Bookings",
            value: stats?.totalBookings || 0,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Pending Bookings",
            value: stats?.pendingBookings || 0,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            title: "Active Trips",
            value: stats?.activeTrips || 0,
            icon: MapPin,
            color: "text-teal-600",
            bgColor: "bg-teal-100",
        },
        {
            title: "Active Activities",
            value: stats?.activeActivities || 0,
            icon: Activity,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            title: "Active Vehicles",
            value: stats?.activeVehicles || 0,
            icon: Car,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100",
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-teal-600" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-gray-600">New booking received</span>
                                <span className="text-xs text-gray-400">2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-gray-600">Trip configuration updated</span>
                                <span className="text-xs text-gray-400">5 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">New activity added</span>
                                <span className="text-xs text-gray-400">1 day ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Booking System</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Processing</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email Notifications</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
