import express from "express"
import { createBooking, getBooking, updateBookingStatus } from "../controllers/booking"

const bookingRoute = express.Router()

bookingRoute.post("/", createBooking);
bookingRoute.get("/:id", getBooking);
bookingRoute.patch("/:id/status", updateBookingStatus)

export default bookingRoute
