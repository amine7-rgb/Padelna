import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1200 }
  },
  { timestamps: true }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 180 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, required: true, trim: true, maxlength: 32 },
    price: { type: Number, required: true, min: 0 },
    previousPrice: { type: Number, min: 0, default: null },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 280 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    heroTag: { type: String, trim: true, maxlength: 120 },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    colors: [{ type: String, trim: true, maxlength: 40 }],
    sizes: [{ type: String, trim: true, maxlength: 20 }],
    badges: [{ type: String, trim: true, maxlength: 60 }],
    benefits: [{ type: String, trim: true, maxlength: 180 }],
    techFeatures: [{ type: String, trim: true, maxlength: 180 }],
    images: [imageSchema],
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
