import express from "express"
import { adminMiddleware } from "../middleware/auth"
import { activities, adminDashboard, bookings, createAccommodation, createActivity, createDateRange, createPricingRule, createTrip, createVehicle, dateRanges, getAccommodations, getVehicles, pricingRules, trips, updateAccommodation, updateActivity, updateTrip, updateVehicle } from "../controllers/admin";

const adminRoute = express.Router();

adminRoute.use(adminMiddleware);

adminRoute.get("/dashboard",adminDashboard);
adminRoute.get("/trips", trips);
adminRoute.post("/trips", createTrip);
adminRoute.put("/trips/:id", updateTrip);
adminRoute.get("/activities", activities);
adminRoute.post("/activities", createActivity);
adminRoute.put("/activities/:id", updateActivity);
adminRoute.get("/bookings", bookings);
adminRoute.get("/pricing/date-ranges",dateRanges);
adminRoute.post("/pricing/date-ranges", createDateRange);
adminRoute.get("/pricing/rules", pricingRules);
adminRoute.post("/pricing/rules", createPricingRule);
adminRoute.post("/vehicle", createVehicle);
adminRoute.get("/vehicle", getVehicles);
adminRoute.put("/vehicle/:id", updateVehicle);
adminRoute.get("/accommadation", getAccommodations);
adminRoute.post("/accommadation", createAccommodation);
adminRoute.put("/accommadation", updateAccommodation);

export default adminRoute;