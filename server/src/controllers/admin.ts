import express from "express"
import { adminMiddleware } from "../middleware/auth"
import { TripConfiguration, TripConfigurationSchema } from "../models/Trip"
import { Activity, ActivitySchema } from "../models/Activity"
import { Vehicle } from "../models/Vehicle"
import { Booking } from "../models/Booking"

const router = express.Router()

router.use(adminMiddleware)

export const adminDashboard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const [totalBookings, pendingBookings, totalRevenue, activeTrips, activeActivities, activeVehicles] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: "pending" }),
        Booking.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$pricing.total" } } },
        ]),
        TripConfiguration.countDocuments({ isActive: true }),
        Activity.countDocuments({ isActive: true }),
        Vehicle.countDocuments({ isActive: true }),
      ])

    res.json({
      totalBookings,
      pendingBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeTrips,
      activeActivities,
      activeVehicles,
    })
  } catch (error) {
    next(error)
  }
};

//trips
export const trips = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const trips = await TripConfiguration.find().sort({ createdAt: -1 })
    res.json(trips)
  } catch (error) {
    next(error)
  }
};

export const createTrip = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = TripConfigurationSchema.parse(req.body)
    const trip = new TripConfiguration(validatedData)
    await trip.save()
    res.status(201).json(trip)
  } catch (error) {
    next(error)
  }
};

export const updateTrip = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = TripConfigurationSchema.parse(req.body)
    const trip = await TripConfiguration.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    })

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    res.json(trip)
  } catch (error) {
    next(error)
  }
};

//activity
export const activities = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const activities = await Activity.find().sort({ name: 1 })
    res.json(activities)
  } catch (error) {
    next(error)
  }
};

export const createActivity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = ActivitySchema.parse(req.body)
    const activity = new Activity(validatedData)
    await activity.save()
    res.status(201).json(activity)
  } catch (error) {
    next(error)
  }
};

export const updateActivity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = ActivitySchema.parse(req.body)
    const activity = await Activity.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true })

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" })
    }

    res.json(activity)
  } catch (error) {
    next(error)
  }
};

//booking
export const bookings = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query

    const filter: any = {}
    if (status) filter.status = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const bookings = await Booking.find(filter)
      .populate("tripId", "name duration")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Booking.countDocuments(filter)

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
};

export default router
