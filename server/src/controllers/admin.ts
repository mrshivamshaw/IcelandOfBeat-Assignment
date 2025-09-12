import express from "express"
import { adminMiddleware } from "../middleware/auth"
import { TripConfiguration, TripConfigurationSchema } from "../models/Trip"
import { Activity, ActivitySchema } from "../models/Activity"
import { Vehicle, VehicleSchema } from "../models/Vehicle"
import { Booking } from "../models/Booking"
import { DateRange, DateRangeSchema, PricingRule, PricingRuleSchema } from "../models/PriceRule"
import { Accommodation, AccommodationSchema } from "../models/Accommadation"

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

//pricing
export const dateRanges = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const dateRanges = await DateRange.find().sort({ startDate: 1 })
    res.json(dateRanges)
  } catch (error) {
    next(error)
  }
};

export const createDateRange = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = DateRangeSchema.parse(req.body)
    const dateRange = new DateRange(validatedData)
    await dateRange.save()
    res.status(201).json(dateRange)
  } catch (error) {
    next(error)
  }
};

export const pricingRules = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const rules = await PricingRule.find()
      .populate("dateRangeId", "name startDate endDate")
      .sort({ itemType: 1, itemId: 1 })
    res.json(rules)
  } catch (error) {
    next(error)
  }
};

export const createPricingRule = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = PricingRuleSchema.parse(req.body)
    const rule = new PricingRule(validatedData)
    await rule.save()
    res.status(201).json(rule)
  } catch (error) {
    next(error)
  }
};

export const createAccommodation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const validateData = AccommodationSchema.parse(req.body)
        if (!validateData) {
            return res.status(400).json({ error: "Invalid accommodation data" })
        }

        const newAccommodation = new Accommodation(validateData)
        await newAccommodation.save()

        res.status(201).json(newAccommodation)
    } catch (error) {
        next(error)
    }
}

export const updateAccommodation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const accommodationId = req.params.id
        const validateData = AccommodationSchema.partial().parse(req.body)
        if (!validateData) {
            return res.status(400).json({ error: "Invalid accommodation data" })
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(accommodationId, validateData, {
            new: true,
            runValidators: true,
        })

        if (!updatedAccommodation) {
            return res.status(404).json({ error: "Accommodation not found" })
        }

        res.json(updatedAccommodation)
    } catch (error) {
        next(error)
    }
}

export const deleteAccommodation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const accommodationId = req.params.id

        const deletedAccommodation = await Accommodation.findByIdAndDelete(accommodationId)

        if (!deletedAccommodation) {
            return res.status(404).json({ error: "Accommodation not found" })
        }

        res.json({ message: "Accommodation deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const getAccommodations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const accommodations = await Accommodation.find()
        res.json(accommodations)
    } catch (error) {
        next(error)
    }
}

export const createVehicle = async(req: express.Request, res: express.Response) => {
    try {
        const validateData = VehicleSchema.parse(req.body)
        if (!validateData) {
            return res.status(400).json({ error: "Invalid Vehicle data" })
        }

        const newVehicle = new Vehicle(validateData);
        await newVehicle.save();

        res.status(201).json(newVehicle)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateVehicle = async(req: express.Request, res: express.Response) => {
    try {
        const vehicleId = req.params.id;
        const validateData = VehicleSchema.partial().parse(req.body)
        if (!validateData) {
            return res.status(400).json({ error: "Invalid Vehicle data" })
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, validateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedVehicle) {
            return res.status(404).json({ error: "Vehicle not found" })
        }

        res.json(updatedVehicle)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteVehicle = async(req: express.Request, res: express.Response) => {
    try {
        const vehicleId = req.params.id;

        const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

        if (!deletedVehicle) {
            return res.status(404).json({ error: "Vehicle not found" })
        }

        res.json({ message: "Vehicle deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getVehicles = async(req: express.Request, res: express.Response) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}