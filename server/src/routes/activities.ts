import express from "express"
import { activities, activity } from "../controllers/activities"

const activityRoute = express.Router()

activityRoute.get("/", activities);
activityRoute.get("/:id", activity);

export default activityRoute;