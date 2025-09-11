import express from "express"
import { PricingEngine } from "../services/PriceEngine"


export const calculatePrice = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { startDate, travelers, selectedAccommodation, selectedVehicle, selectedActivities, extraNights, duration } =
            req.body

        const pricingEngine = new PricingEngine()
        const pricing = await pricingEngine.calculateBookingPrice({
            startDate,
            travelers,
            selectedAccommodation,
            selectedVehicle,
            selectedActivities: selectedActivities || [],
            extraNights,
            duration,
        })

        res.json(pricing)
    } catch (error) {
        next(error)
    }
};
