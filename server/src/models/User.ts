import { z } from "zod"
import mongoose, { Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export const UserScehma = z.object({
    email : z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(["user", "admin"]).default("user"),
    isActive: z.boolean().default(true)
});

export type UserType = z.infer<typeof UserScehma>;

export interface IUser extends Document{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserModelSchema: Schema = new Schema<IUser>(
    {
        email: {type: String, required: true, unique: true},
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

//hash password before saving
UserModelSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

UserModelSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserModelSchema);
