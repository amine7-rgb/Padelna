import { Router } from "express";
import {
  createCardCheckoutSession,
  createCashOrder,
  getCheckoutOrder,
  getCheckoutSessionStatus
} from "../controllers/checkoutController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/card-session", requireAuth, createCardCheckoutSession);
router.post("/cash-order", requireAuth, createCashOrder);
router.get("/orders/:orderNumber", requireAuth, getCheckoutOrder);
router.get("/session/:sessionId", requireAuth, getCheckoutSessionStatus);

export default router;
