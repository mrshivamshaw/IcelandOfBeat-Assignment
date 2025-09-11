import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const AccommodationSchema = z.object({
    name: z.string().min(1),
    type: z.enum(["economy", "comfort", "superior", "luxury"]),
    description: z.string(),
    imgUrl: z.string().url().optional(),
    maxOccupancy: z.number().min(1),
    images: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
})

export type AccommodationType = z.infer<typeof AccommodationSchema>

export interface IAccommodation extends Document {
    name: string
    type: "economy" | "comfort" | "superior" | "luxury"
    description: string
    imgUrl?: string
    maxOccupancy: number
    images?: string[]
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const AccommodationModelSchema = new Schema<IAccommodation>(
    {
        name: { type: String, required: true, unique: true },
        type: {
            type: String,
            required: true,
            enum: ["economy", "comfort", "superior", "luxury"],
        },
        description: { type: String, required: true },
        imgUrl: { type: String },
        maxOccupancy: { type: Number, required: true, min: 1 },
        images: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
)

export const Accommodation = mongoose.model<IAccommodation>("Accommodation", AccommodationModelSchema)
