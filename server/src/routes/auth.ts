import express from "express"
import { authMiddleware } from "../middleware/auth"
import { login, me, register } from "../controllers/auth"

const router = express.Router()

router.post("/register",register)
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router
