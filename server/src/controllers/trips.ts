import express from "express"
import { TripConfiguration } from "../models/Trip"
import { Activity } from "../models/Activity"
import { Accommodation } from "../models/Accommadation"
import { Vehicle } from "../models/Vehicle"
import { IDateRange, PricingRule } from "../models/PriceRule"


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

        //fetch accommodations with high/low pricing
        const accommodations = await Promise.all(
            trip.accommodations.map(async (accommodationId) => {
                const acc = await Accommodation.findOne({ _id: accommodationId, isActive: true })
                if (!acc) return null

                const pricingRules = await PricingRule.find({
                    itemType: "accommodation",
                    itemId: accommodationId,
                    isActive: true,
                }).populate<{ dateRangeId: IDateRange }>("dateRangeId")


                const highRule = pricingRules.find(r => r.dateRangeId?.name.toLowerCase().includes("high"))
                const lowRule = pricingRules.find(r => r.dateRangeId?.name.toLowerCase().includes("low"))

                return {
                    ...acc.toObject(),
                    highPrice: highRule ? {
                        basePrice: highRule.basePrice,
                        perPersonPrice: highRule.perPersonPrice,
                    } : null,
                    lowPrice: lowRule ? {
                        basePrice: lowRule.basePrice,
                        perPersonPrice: lowRule.perPersonPrice,
                    } : null,
                }
            })
        )

        //fetch vehicles with high/low pricing
        const vehicles = await Promise.all(
            trip.vehicles.map(async (vehicleId) => {
                const veh = await Vehicle.findOne({ _id: vehicleId, isActive: true })
                if (!veh) return null

                const pricingRules = await PricingRule.find({
                    itemType: "vehicle",
                    itemId: vehicleId,
                    isActive: true,
                }).populate<{ dateRangeId: IDateRange }>("dateRangeId")

                const highRule = pricingRules.find(r => r.dateRangeId?.name.toLowerCase().includes("high"))
                const lowRule = pricingRules.find(r => r.dateRangeId?.name.toLowerCase().includes("low"))

                return {
                    ...veh.toObject(),
                    highPrice: highRule ? {
                        basePrice: highRule.basePrice,
                        perPersonPrice: highRule.perPersonPrice,
                    } : null,
                    lowPrice: lowRule ? {
                        basePrice: lowRule.basePrice,
                        perPersonPrice: lowRule.perPersonPrice,
                    } : null,
                }
            })
        )

        //fetch day activities with details
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
            accommodations: accommodations.filter(Boolean),
            vehicles: vehicles.filter(Boolean),
            dayActivities: dayActivitiesWithDetails,
        })
    } catch (error) {
        next(error)
    }
}

