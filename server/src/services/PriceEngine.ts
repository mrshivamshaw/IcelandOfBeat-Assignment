import { DateRange, PricingRule } from "../models/PriceRule"
import { Activity } from "../models/Activity"

export class PricingEngine {
    async calculateBookingPrice(bookingData: {
        startDate: string
        travelers: { adults: number; children: number; infants: number }
        selectedAccommodation: string
        selectedVehicle: string
        selectedActivities: string[]
        extraNights?: { before: number; after: number }
        duration: number
    }) {
        const breakdown: any[] = []
        let accommodationTotal = 0
        let vehicleTotal = 0
        let activitiesTotal = 0
        let extrasTotal = 0

        const dateRange = await this.findDateRange(bookingData.startDate)

        //accommodation pricing
        const accommodationPrice = await this.getAccommodationPrice(
            bookingData.selectedAccommodation,
            dateRange?._id,
            bookingData.travelers.adults + bookingData.travelers.children,
        )
        accommodationTotal = accommodationPrice * bookingData.duration
        breakdown.push({
            type: "accommodation",
            name: bookingData.selectedAccommodation,
            price: accommodationPrice,
            quantity: bookingData.duration,
            total: accommodationTotal,
        })

        //vehicle pricing
        const vehiclePrice = await this.getVehiclePrice(bookingData.selectedVehicle, dateRange?._id)
        vehicleTotal = vehiclePrice * bookingData.duration
        breakdown.push({
            type: "vehicle",
            name: bookingData.selectedVehicle,
            price: vehiclePrice,
            quantity: bookingData.duration,
            total: vehicleTotal,
        })

        //activities pricing
        for (const activityId of bookingData.selectedActivities) {
            const activity = await Activity.findById(activityId)
            if (activity) {
                const activityPrice = await this.getActivityPrice(
                    activityId,
                    dateRange?._id,
                    bookingData.travelers.adults + bookingData.travelers.children,
                )
                activitiesTotal += activityPrice
                breakdown.push({
                    type: "activity",
                    name: activity.name,
                    price: activityPrice,
                    quantity: 1,
                    total: activityPrice,
                })
            }
        }

        //extra nights
        if (bookingData.extraNights?.before) {
            const extraPrice = accommodationPrice * bookingData.extraNights.before
            extrasTotal += extraPrice
            breakdown.push({
                type: "extra",
                name: `Extra nights before (${bookingData.extraNights.before})`,
                price: accommodationPrice,
                quantity: bookingData.extraNights.before,
                total: extraPrice,
            })
        }

        if (bookingData.extraNights?.after) {
            const extraPrice = accommodationPrice * bookingData.extraNights.after
            extrasTotal += extraPrice
            breakdown.push({
                type: "extra",
                name: `Extra nights after (${bookingData.extraNights.after})`,
                price: accommodationPrice,
                quantity: bookingData.extraNights.after,
                total: extraPrice,
            })
        }

        const subtotal = accommodationTotal + vehicleTotal + activitiesTotal + extrasTotal
        const taxes = subtotal * 0.24
        const total = subtotal + taxes

        return {
            accommodationTotal,
            vehicleTotal,
            activitiesTotal,
            extrasTotal,
            subtotal,
            taxes,
            total,
            breakdown,
        }
    }

    private async findDateRange(date: string) {
        const bookingDate = new Date(date)
        return await DateRange.findOne({
            startDate: { $lte: bookingDate },
            endDate: { $gte: bookingDate },
            isActive: true,
        })
    }

    private async getAccommodationPrice(accommodationId: string, dateRangeId: any, guests: number): Promise<number> {
        const rule = await PricingRule.findOne({
            itemType: "accommodation",
            itemId: accommodationId,
            dateRangeId,
            isActive: true,
        })

        if (rule) {
            return rule.basePrice + rule.perPersonPrice * guests
        }

        return 10000
    }

    private async getVehiclePrice(vehicleId: string, dateRangeId: any): Promise<number> {
        const rule = await PricingRule.findOne({
            itemType: "vehicle",
            itemId: vehicleId,
            dateRangeId,
            isActive: true,
        })

        if (rule) {
            return rule.basePrice
        }

        return 15000
    }

    private async getActivityPrice(activityId: string, dateRangeId: any, participants: number): Promise<number> {
        const rule = await PricingRule.findOne({
            itemType: "activity",
            itemId: activityId,
            dateRangeId,
            isActive: true,
        })

        if (rule) {
            return rule.basePrice + rule.perPersonPrice * participants
        }

        const activity = await Activity.findById(activityId)
        if (activity) {
            return activity.perPersonPrice + activity.perPersonPrice * participants
        }

        return 5000
    }
}
