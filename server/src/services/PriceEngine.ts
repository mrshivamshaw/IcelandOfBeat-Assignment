import { DateRange, PricingRule } from "../models/PriceRule"
import { Activity } from "../models/Activity"
import { TripConfiguration } from "../models/Trip";

export class PricingEngine {
    async calculateBookingPrice(bookingData: {
        startDate: string
        travelers: { adults: number; children: number; infants: number }
        selectedAccommodation: string
        selectedVehicle: string
        selectedActivities: string[]
        extraNights?: { before: number; after: number }
        duration: number
        tripId: string
    }) {
        const breakdown: any[] = []
        let accommodationTotal = 0
        let vehicleTotal = 0
        let activitiesTotal = 0
        let extrasTotal = 0
        console.log("bookingData : ",bookingData);
        

        const dateRange = await this.findDateRange(bookingData.startDate)

        console.log("dateRange : ",dateRange);
        

        //accommodation pricing
        const accommodationPrice = await this.getAccommodationPrice(
            bookingData.selectedAccommodation,
            dateRange?._id,
            bookingData.travelers.adults + bookingData.travelers.children,
        )
        
        accommodationTotal = accommodationPrice * bookingData.duration
        console.log("accommodationTotal : ", accommodationTotal);
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
        console.log("vehicleTotal : ", vehicleTotal);

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

        console.log("activitiesTotal : ", activitiesTotal);

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
        const tripPrice = await TripConfiguration.findById(bookingData.tripId);
        const subtotal = accommodationTotal + vehicleTotal + activitiesTotal + extrasTotal + (tripPrice?.price || 0)
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
        const bookingMonthDay = (bookingDate.getMonth() + 1) * 100 + bookingDate.getDate()

        const ranges = await DateRange.find({ isActive: true })

        return ranges.find((r) => {
            const start = (r.startDate.getMonth() + 1) * 100 + r.startDate.getDate()
            const end = (r.endDate.getMonth() + 1) * 100 + r.endDate.getDate()
            return bookingMonthDay >= start && bookingMonthDay <= end
        }) || null
    }


    private async getAccommodationPrice(accommodationId: string, dateRangeId: any, guests: number): Promise<number> {
        const rule = await PricingRule.findOne({
            itemType: "accommodation",
            itemId: accommodationId,
            dateRangeId,
            isActive: true,
        })

        console.log("rule for accommodation: ", rule);
        

        if (rule) {
            return rule.basePrice + rule.perPersonPrice * guests
        }

        return 0
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

        return 0
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
            return activity.perPersonPrice * participants
        }

        return 0
    }
}
