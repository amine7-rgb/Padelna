import { Router } from "express";
import {
  createCardCheckoutSession,
  createCashOrder,
  getCheckoutOrder,
  getCheckoutSessionStatus
} from "../controllers/checkoutController.js";

const router = Router();

router.post("/card-session", createCardCheckoutSession);
router.post("/cash-order", createCashOrder);
router.get("/orders/:orderNumber", getCheckoutOrder);
router.get("/session/:sessionId", getCheckoutSessionStatus);

export default router;
