import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { LayoutDashboard, MapPin, Activity, DollarSign, Calendar, Car, Home,  } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Trips", href: "/admin/trips", icon: MapPin },
  { name: "Activities", href: "/admin/activities", icon: Activity },
  { name: "Vehicles", href: "/admin/vehicle", icon: Car },
  { name: "Accommadations", href: "/admin/accommadation", icon: Home },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
]

export default function AdminSidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
