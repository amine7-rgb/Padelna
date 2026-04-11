import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    company: { type: String, trim: true, maxlength: 180 },
    budget: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    source: { type: String, default: "padelna-store" }
  },
  { timestamps: true }
);

export const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

