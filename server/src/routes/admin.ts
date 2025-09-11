import express from "express"
import { adminMiddleware } from "../middleware/auth"
import { activities, adminDashboard, bookings, createActivity, createTrip, trips, updateActivity, updateTrip } from "../controllers/admin";

const adminRoute = express.Router();

adminRoute.use(adminMiddleware);

adminRoute.post("/dashboard",adminDashboard);
adminRoute.get("/trips", trips);
adminRoute.post("/trips", createTrip);
adminRoute.put("/trips/:id", updateTrip);
adminRoute.get("/activities", activities);
adminRoute.post("/activities", createActivity);
adminRoute.put("/activities/:id", updateActivity);
adminRoute.get("/bookings", bookings);

export default adminRoute;