import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectMongo } from "./config/db.js";
import { seedProductsIfEmpty } from "./data/seed.js";
import { handleStripeWebhook } from "./controllers/checkoutController.js";
import passport, { configurePassport } from "./config/passport.js";
import { seedAdminUserIfNeeded } from "./services/userAccounts.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/padelna_store";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

configurePassport();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "padelna-dev-cookie-secret-change-me"));
app.post("/api/checkout/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "padelna-store-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/checkout", checkoutRoutes);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const start = async () => {
  try {
    await connectMongo(mongoUri);
    const seeded = await seedProductsIfEmpty();
    const adminSeeded = await seedAdminUserIfNeeded();
    console.log(seeded ? "MongoDB connected and products seeded." : "MongoDB connected.");
    if (adminSeeded) {
      console.log("Default admin account created.");
    }
  } catch (error) {
    console.warn(`MongoDB connection skipped: ${error.message}`);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Padelna API listening on http://localhost:${port}`);
  });
};

start();
