import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const DateRangeSchema = z.object({
    name: z.string().min(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    isActive: z.boolean().default(true),
})

export const PricingRuleSchema = z.object({
    itemType: z.enum(["accommodation", "vehicle", "activity"]),
    itemId: z.string().min(1),
    dateRangeId: z.string().min(1),
    basePrice: z.number().min(0),
    perPersonPrice: z.number().min(0).default(0),
    isActive: z.boolean().default(true),
})

export type DateRangeType = z.infer<typeof DateRangeSchema>
export type PricingRuleType = z.infer<typeof PricingRuleSchema>

export interface IDateRange extends Document {
    name: string
    startDate: Date
    endDate: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IPricingRule extends Document {
    itemType: "accommodation" | "vehicle" | "activity"
    itemId: string
    dateRangeId: mongoose.Types.ObjectId
    basePrice: number
    perPersonPrice: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const DateRangeModelSchema = new Schema<IDateRange>(
    {
        name: { type: String, required: true, unique: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
)

const PricingRuleModelSchema = new Schema<IPricingRule>(
    {
        itemType: {
            type: String,
            required: true,
            enum: ["accommodation", "vehicle", "activity"],
        },
        itemId: { type: String, required: true },
        dateRangeId: { type: Schema.Types.ObjectId, ref: "DateRange", required: true },
        basePrice: { type: Number, required: true, min: 0 },
        perPersonPrice: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
)

export const DateRange = mongoose.model<IDateRange>("DateRange", DateRangeModelSchema)
export const PricingRule = mongoose.model<IPricingRule>("PricingRule", PricingRuleModelSchema)
