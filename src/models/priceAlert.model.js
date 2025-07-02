import mongoose from "mongoose";

const priceAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
    },

    productUrl: {
      type: String,
    },

    source: {
      type: String,
    },

    targetPrice: {
      type: Number,
    },

    currentPrice: {
      type: Number,
    },

    isTriggered: {
      type: Boolean,
      default: false,
    },

    lastCheckedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const PriceAlert = mongoose.model("PriceAlert", priceAlertSchema);
