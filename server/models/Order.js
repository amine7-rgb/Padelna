import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, trim: true, maxlength: 40 },
    size: { type: String, trim: true, maxlength: 20, default: null },
    image: { type: String, trim: true, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceTnd: { type: Number, required: true, min: 0 },
    subtotalTnd: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, trim: true, maxlength: 180 },
    phone: { type: String, required: true, trim: true, maxlength: 60 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
    postalCode: { type: String, trim: true, maxlength: 40, default: "" },
    notes: { type: String, trim: true, maxlength: 1200, default: "" }
  },
  { _id: false }
);

const totalsSchema = new mongoose.Schema(
  {
    subtotalTnd: { type: Number, required: true, min: 0 },
    deliveryTnd: { type: Number, required: true, min: 0 },
    vatTnd: { type: Number, required: true, min: 0 },
    totalTnd: { type: Number, required: true, min: 0 },
    cardCurrency: { type: String, trim: true, lowercase: true, default: "eur" },
    cardExchangeRate: { type: Number, default: null },
    cardTotalMinor: { type: Number, default: null }
  },
  { _id: false }
);

const createOrderNumber = () => {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PDL-${stamp}-${suffix}`;
};

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: createOrderNumber
    },
    customer: { type: customerSchema, required: true },
    items: { type: [orderItemSchema], default: [] },
    totals: { type: totalsSchema, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "cash_on_delivery"]
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "cash_due"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["awaiting_payment", "confirmed", "preparing", "cancelled"],
      default: "awaiting_payment"
    },
    customerEmailSentAt: { type: Date, default: null },
    adminEmailSentAt: { type: Date, default: null },
    stripeSessionId: { type: String, trim: true, default: "" },
    stripePaymentIntentId: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
