import express from "express"
import { TripConfiguration } from "../models/Trip"
import { Activity } from "../models/Activity"
import { Accommodation } from "../models/Accommadation"
import { Vehicle } from "../models/Vehicle"


export const getTrips = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const trips = await TripConfiguration.find({ isActive: true }).select("-__v").sort({ createdAt: -1 })

        res.json(trips)
    } catch (error) {
        next(error)
    }
};

export const getTripByID = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const trip = await TripConfiguration.findById(req.params.id)

        if (!trip || !trip.isActive) {
            return res.status(404).json({ error: "Trip not found" })
        }

        const accommodations = await Accommodation.find({
            _id: { $in: trip.accommodations },
            isActive: true,
        })

        const vehicles = await Vehicle.find({
            _id: { $in: trip.vehicles },
            isActive: true,
        })

        const dayActivitiesWithDetails = await Promise.all(
            trip.dayActivities.map(async (dayActivity) => {
                const activities = await Activity.find({
                    _id: { $in: dayActivity.availableActivities },
                    isActive: true,
                })

                return {
                    day: dayActivity.day,
                    maxActivities: dayActivity.maxActivities,
                    activities,
                }
            }),
        )

        res.json({
            ...trip.toObject(),
            accommodations,
            vehicles,
            dayActivities: dayActivitiesWithDetails,
        })
    } catch (error) {
        next(error)
    }
};
