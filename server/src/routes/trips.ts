import express from "express"
import { getTripByID, getTrips } from "../controllers/trips"

const tripRoute = express.Router()

tripRoute.get("/", getTrips);
tripRoute.get("/:id", getTripByID);

export default tripRoute
