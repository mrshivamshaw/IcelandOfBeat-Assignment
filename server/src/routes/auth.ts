import express from "express"
import { authMiddleware } from "../middleware/auth"
import { login, me, register } from "../controllers/auth"

const authRoute = express.Router();

authRoute.post("/register",register)
authRoute.post("/login", login);
authRoute.get("/me", authMiddleware, me);

export default authRoute
