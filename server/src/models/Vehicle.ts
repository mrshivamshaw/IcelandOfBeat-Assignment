import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const VehicleSchema = z.object({
  name: z.string().min(1),
  carModel: z.string().min(1),
  type: z.enum(["suv", "sedan", "minivan", "luxury"]),
  noPassengers: z.preprocess((val) => Number(val), z.number().min(1)),
  noDoors: z.preprocess((val) => Number(val), z.number().min(1)),
  noSuitcases: z.preprocess((val) => Number(val), z.number().min(1)),
  transmission: z.enum(["manual", "automatic"]),
  features: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return val
  }, z.array(z.string())),
  images: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val)
      } catch {
        return [val]
      }
    }
    return val
  }, z.array(z.string()).optional()),
  isActive: z.preprocess((val) => {
    if (val === "true" || val === true) return true
    if (val === "false" || val === false) return false
    return true // default
  }, z.boolean()),
})


export type VehicleType = z.infer<typeof VehicleSchema>

export interface IVehicle extends Document{
  name: string;
  carModel: string
  type: "suv" | "sedan" | "minivan" | "luxury";
  noPassengers: number;
  noDoors: number;
  noSuitcases: number;
  transmission: "manual" | "automatic";
  features: string[];
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleModelSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true, unique: true },
    carModel: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["suv", "sedan", "minivan", "luxury"],
    },
    noPassengers: { type: Number, required: true, min: 1 },
    noDoors: { type: Number, required: true, min: 1 },
    noSuitcases: { type: Number, required: true, min: 1 },
    transmission: {
      type: String,
      required: true,
      enum: ["manual", "automatic"],
    },
    features: [{ type: String, required: true }],
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleModelSchema)
