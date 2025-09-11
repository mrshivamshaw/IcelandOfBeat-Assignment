import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", error)

    //zod validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Validation error",
            details: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        })
    }

    //mongoDB validation error
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message,
        }))
        return res.status(400).json({
            error: "Validation error",
            details: errors,
        })
    }

    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" })
    }

    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" })
    }

    res.status(error.status || 500).json({
        error: error.message || "Internal server error",
    })
}
