import express from "express"
import { Booking, BookingSchema } from "../models/Booking"
import { TripConfiguration } from "../models/Trip"
import { PricingEngine } from "../services/PriceEngine"
import bookingRoute from "../routes/booking";

export const createBooking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const validatedData = BookingSchema.parse(req.body)

    const trip = await TripConfiguration.findById(validatedData.tripId)
    if (!trip || !trip.isActive) {
      return res.status(404).json({ error: "Trip not found" })
    }

    //calculate pricing
    const pricingEngine = new PricingEngine()
    const pricing = await pricingEngine.calculateBookingPrice({
      startDate: validatedData.startDate.toISOString(),
      travelers: validatedData.travelers,
      selectedAccommodation: validatedData.selectedAccommodation,
      selectedVehicle: validatedData.selectedVehicle,
      selectedActivities: validatedData.selectedActivities,
      extraNights: validatedData.extraNights,
      duration: trip.duration,
      tripId: trip?._id as string,
    })

    const booking = new Booking({
      ...validatedData,
      pricing,
    })

    await booking.save()

    res.status(201).json(booking)
  } catch (error) {
    next(error)
  }
};

export const getBooking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("tripId", "name description duration")

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    next(error)
  }
};

export const updateBookingStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { status, paymentStatus } = req.body

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (status) booking.status = status
    if (paymentStatus) booking.paymentStatus = paymentStatus

    await booking.save()

    res.json(booking)
  } catch (error) {
    next(error)
  }
};

export default bookingRoute;
