import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { connectDatabase } from "./config/database"
import { errorHandler } from "./middleware/errorHandler"
import { authMiddleware } from "./middleware/auth"

// Import routes
import authRoutes from "./routes/auth"
import tripRoutes from "./routes/trips"
import activityRoutes from "./routes/activities"
import bookingRoutes from "./routes/booking"
import pricingRoutes from "./routes/pricing"
import adminRoutes from "./routes/admin"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.use("/api/auth", authRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/pricing", pricingRoutes)

app.use("/api/admin", authMiddleware, adminRoutes)

app.use(errorHandler)
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

const startServer = async () => {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app
