import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const BookingSchema = z.object({
    tripId: z.string().min(1),
    customerInfo: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.object({
            street: z.string(),
            city: z.string(),
            country: z.string(),
            zipCode: z.string(),
        }),
    }),
    travelers: z.object({
        adults: z.number().min(1),
        children: z.number().min(0),
        infants: z.number().min(0),
    }),
    travelerDetails: z.array(z.object({
        title: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        dateOfBirth: z.string(),
        passportNumber: z.string().optional(),
        countryOfResidence: z.string().min(1),
        type: z.enum(["adult", "child", "infant"]),
    })).optional(),
    startDate: z.coerce.date(),
    selectedAccommodation: z.string(),
    selectedVehicle: z.string(),
    selectedActivities: z.array(z.string()),
    extraNights: z
        .object({
            before: z.number().min(0).default(0),
            after: z.number().min(0).default(0),
        })
        .optional(),
    pricing: z.object({
        subtotal: z.number(),
        taxes: z.number(),
        total: z.number(),
        breakdown: z.array(z.any()),
    }),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
    paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
})

export type BookingType = z.infer<typeof BookingSchema>

export interface IBooking extends Document {
    tripId: mongoose.Types.ObjectId
    customerInfo: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address: {
            street: string
            city: string
            country: string
            zipCode: string
        }
    }
    travelers: {
        adults: number
        children: number
        infants: number
    },
    travelerDetails?: Array<{
        title?: string
        firstName: string
        lastName: string
        dateOfBirth: Date
        passportNumber?: string
        countryOfResidence: string
        type: "adult" | "child" | "infant"
    }>
    startDate: Date
    selectedAccommodation: string
    selectedVehicle: string
    selectedActivities: string[]
    extraNights?: {
        before: number
        after: number
    }
    pricing: {
        subtotal: number
        taxes: number
        total: number
        breakdown: any[]
    }
    status: "pending" | "confirmed" | "cancelled" | "completed"
    paymentStatus: "pending" | "paid" | "refunded"
    createdAt: Date
    updatedAt: Date
}

const BookingModelSchema = new Schema<IBooking>(
    {
        tripId: { type: Schema.Types.ObjectId, ref: "TripConfiguration", required: true },
        customerInfo: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: {
                street: { type: String, required: true },
                city: { type: String, required: true },
                country: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
        },
        travelers: {
            adults: { type: Number, required: true, min: 1 },
            children: { type: Number, default: 0, min: 0 },
            infants: { type: Number, default: 0, min: 0 },
        },
        travelerDetails: [{
            title: { type: String, enum: ["Mr", "Mrs", "Ms", "Dr"] },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dateOfBirth: { type: Date, required: true },
            passportNumber: { type: String },
            countryOfResidence: { type: String, required: true },
            type: { 
                type: String, 
                enum: ["adult", "child", "infant"], 
                required: true 
            },
        }],
        startDate: { type: Date, required: true },
        selectedAccommodation: { type: String, required: true },
        selectedVehicle: { type: String, required: true },
        selectedActivities: [{ type: String }],
        extraNights: {
            before: { type: Number, default: 0, min: 0 },
            after: { type: Number, default: 0, min: 0 },
        },
        pricing: {
            subtotal: { type: Number, required: true },
            taxes: { type: Number, required: true },
            total: { type: Number, required: true },
            breakdown: [{ type: Schema.Types.Mixed }],
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    },
)

export const Booking = mongoose.model<IBooking>("Booking", BookingModelSchema)
