import express from "express"
import { calculatePrice } from "../controllers/princing";

const pricingRoute = express.Router();

pricingRoute.post("/calculate", calculatePrice);

export default pricingRoute;