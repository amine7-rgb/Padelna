import express from "express";
import { addProductReview, getProductBySlug, listProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:slug", getProductBySlug);
router.post("/:slug/reviews", addProductReview);

export default router;

