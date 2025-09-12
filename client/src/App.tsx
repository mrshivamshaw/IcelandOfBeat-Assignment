import HomePage from "@/pages/Home"
import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./components/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminTrips from "./pages/admin/AdminTrips"
import AdminActivities from "./pages/admin/AdminActivities"
import AdminPricing from "./pages/admin/AdminPricing"
import AdminBookings from "./pages/admin/AdminBookings"
import BookingPage from "./pages/Booking"
import AdminVehicles from "./pages/admin/AdminVehicle"


function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking/:tripId" element={<BookingPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="vechile" element={<AdminVehicles />} />
        </Route>
      </Routes>
    </div>

  )
}

export default App
