import mongoose, { Schema, type Document } from "mongoose"
import { z } from "zod"

const stringOrArray = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch {
      return [val]
    }
  }
  return val
}, z.array(z.string()))

const dayActivitiesSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch {
      return []
    }
  }
  return val
}, z.array(
  z.object({
    day: z.coerce.number().min(1),
    maxActivities: z.preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return 0
        return val
      },
      z.coerce.number().min(0)
    ).default(0),
    availableActivities: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val)
        } catch {
          return [val]
        }
      }
      return val
    }, z.array(z.string()))
  })
))


export const TripConfigurationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  dayDuration: z.coerce.number().min(1),
  nightDuration: z.coerce.number().min(1),
  duration: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  isActive: z.coerce.boolean().default(true),
  accommodations: stringOrArray,
  vehicles: stringOrArray,
  dayActivities: dayActivitiesSchema,
  images: stringOrArray.optional(),
  tags: stringOrArray.optional(),
})



export type TripConfigurationType = z.infer<typeof TripConfigurationSchema>

export interface ITripConfiguration extends Document {
    name: string
    description: string
    dayDuration: number
    nightDuration: number
    duration: number
    price: number
    imgUrl?: string[]
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
        imgUrl: [{ type: String }],
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
