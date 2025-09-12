import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

export const ActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(["adventure", "cultural", "nature", "relaxation", "sightseeing"]),
  duration: z.coerce.number().min(0.5),
  perPersonPrice: z.coerce.number().min(0),
  isActive: z.coerce.boolean().default(true),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  includes: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val)
      } catch {
        return [val]
      }
    }
    return val
  }, z.array(z.string()).optional()),
  excludes: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val)
      } catch {
        return [val]
      }
    }
    return val
  }, z.array(z.string()).optional()),
  details: z.string().optional(),
})


export type ActivityType = z.infer<typeof ActivitySchema>

export interface IActivity extends Document{
  name: string
  description: string
  category: "adventure" | "cultural" | "nature" | "relaxation" | "sightseeing"
  duration: number
  perPersonPrice: number
  isActive: boolean
  images?: string[]
  location?: string
  includes?: string[]
  excludes?: string[]
  details?: string[]
  createdAt: Date
  updatedAt: Date
}

const ActivityModelSchema = new Schema<IActivity>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["adventure", "cultural", "nature", "relaxation", "sightseeing"],
    },
    duration: { type: Number, required: true, min: 0.5 },
    perPersonPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
    location: { type: String },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    details: [{ type: String }],
  },
  {
    timestamps: true,
  },
)

export const Activity = mongoose.model<IActivity>("Activity", ActivityModelSchema)
