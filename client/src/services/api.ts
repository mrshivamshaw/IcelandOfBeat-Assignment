import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//auth api
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

//trip api
export const tripsApi = {
  getAll: async () => {
    const response = await api.get("/trips")
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/trips/${id}`)
    return response.data
  },
}

//booking API
export const bookingsApi = {
  create: async (bookingData: any) => {
    const response = await api.post("/bookings", bookingData)
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  updateStatus: async (id: string, status: any) => {
    const response = await api.patch(`/bookings/${id}/status`, status)
    return response.data
  },
}

//pricing API
export const pricingApi = {
  calculate: async (pricingData: any) => {
    const response = await api.post("/pricing/calculate", pricingData)
    return response.data
  },
}

//activities API
export const activitiesApi = {
  getAll: async (params?: any) => {
    const response = await api.get("/activities", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/activities/${id}`)
    return response.data
  },
}

//admin api
export const adminApi = {
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard")
    return response.data
  },

  //trips
  getTrips: async () => {
    const response = await api.get("/admin/trips")
    return response.data
  },

  createTrip: async (tripData: any) => {
    const response = await api.post("/admin/trips", tripData)
    return response.data
  },

  updateTrip: async (id: string, tripData: any) => {
    const response = await api.put(`/admin/trips/${id}`, tripData)
    return response.data
  },
  //activities
  getActivities: async () => {
    const response = await api.get("/admin/activities")
    return response.data
  },

  createActivity: async (activityData: any) => {
    const response = await api.post("/admin/activities", activityData)
    return response.data
  },

  updateActivity: async (id: string, activityData: any) => {
    const response = await api.put(`/admin/activities/${id}`, activityData)
    return response.data
  },

  //pricing
  getDateRanges: async () => {
    const response = await api.get("/admin/pricing/date-ranges")
    return response.data
  },

  createDateRange: async (dateRangeData: any) => {
    const response = await api.post("/admin/pricing/date-ranges", dateRangeData)
    return response.data
  },

  getPricingRules: async () => {
    const response = await api.get("/admin/pricing/rules")
    return response.data
  },

  createPricingRule: async (ruleData: any) => {
    const response = await api.post("/admin/pricing/rules", ruleData)
    return response.data
  },

  //bookings
  getBookings: async (params?: any) => {
    const response = await api.get("/admin/bookings", { params })
    return response.data
  },
}
