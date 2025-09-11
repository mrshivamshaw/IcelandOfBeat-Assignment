import mongoose, { Schema, type Document } from "mongoose"
import { number, z } from "zod"

export const TripConfigurationSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    dayDuration: z.number().min(1),
    nightDuration: z.number().min(1),
    duration: z.number().min(1),
    price: z.number().min(0),
    isActive: z.boolean().default(true),
    accommodations: z.array(z.string()),
    vehicles: z.array(z.string()),
    dayActivities: z.array(
        z.object({
            day: z.number(),
            maxActivities: z.number(),
            availableActivities: z.array(z.string()),
        }),
    ),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
})

export type TripConfigurationType = z.infer<typeof TripConfigurationSchema>

export interface ITripConfiguration extends Document {
    name: string
    description: string
    dayDuration: number
    nightDuration: number
    duration: number
    price: number
    isActive: boolean
    accommodations: string[]
    vehicles: string[]
    dayActivities: Array<{
        day: number
        maxActivities: number
        availableActivities: string[]
    }>
    images?: string[]
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}

const TripConfigurationModelSchema= new Schema<ITripConfiguration>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        dayDuration: { type: Number, required: true, min: 1 },
        nightDuration: { type: Number, required: true, min: 1 },
        duration: {type: Number, required: true, min: 1},
        price: { type: Number, required: true, min: 0 },
        isActive: { type: Boolean, default: true },
        accommodations: [{ type: String, required: true }],
        vehicles: [{ type: String, required: true }],
        dayActivities: [
            {
                day: { type: Number, required: true },
                maxActivities: { type: Number, required: true },
                availableActivities: [{ type: String, required: true }],
            },
        ],
        images: [{ type: String }],
        tags: [{ type: String }],
    },
    {
        timestamps: true,
    },
)

export const TripConfiguration = mongoose.model<ITripConfiguration>(
    "TripConfiguration",
    TripConfigurationModelSchema,
)
