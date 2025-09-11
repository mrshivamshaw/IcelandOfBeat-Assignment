import express from "express"
import { Activity } from "../models/Activity"

//get activitie
export const activities = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { category, isActive } = req.query

    const filter: any = {}
    if (category) filter.category = category
    if (isActive !== undefined) filter.isActive = isActive === "true"

    const activities = await Activity.find(filter).select("-__v").sort({ name: 1 })

    res.json(activities)
  } catch (error) {
    next(error)
  }
};

//get activity by ID
export const activity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const activity = await Activity.findById(req.params.id)

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" })
    }

    res.json(activity)
  } catch (error) {
    next(error)
  }
};

