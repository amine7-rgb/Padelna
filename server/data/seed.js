import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedProducts } from "./products.js";
import { Product } from "../models/Product.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

export const seedProductsIfEmpty = async () => {
  if (!mongoUri || mongoose.connection.readyState !== 1) {
    return false;
  }

  const count = await Product.countDocuments();

  if (count > 0) {
    return false;
  }

  await Product.insertMany(seedProducts);
  return true;
};

const run = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log(`Seeded ${seedProducts.length} products into MongoDB.`);
  await mongoose.disconnect();
};

if (process.argv[1]?.endsWith("seed.js")) {
  run().catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  });
}

