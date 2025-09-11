import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const VehicleSchema = z.object({
  name: z.string().min(1),
  carModel: z.string().min(1),
  type: z.enum(["suv", "sedan", "minivan", "luxury"]),
  noPassengers: z.number().min(1),
  noDoors: z.number().min(1),
  noSuitcases: z.number().min(1),
  transmission: z.enum(["manual", "automatic"]),
  features: z.array(z.string()),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

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
