import express from "express"
import jwt from "jsonwebtoken"
import { User, UserScehma } from "../models/User"

export const register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const validatedData = UserScehma.parse(req.body)

        const existingUser = await User.findOne({ email: validatedData.email })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }

        const user = new User(validatedData)
        await user.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        })
    } catch (error) {
        next(error)
    }
};

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email, isActive: true })
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        })
    } catch (error) {
        next(error)
    }
};

export const me = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                role: req.user.role,
            },
        })
    } catch (error) {
        next(error)
    }
};
