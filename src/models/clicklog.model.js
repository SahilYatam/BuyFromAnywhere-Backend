import mongoose from "mongoose";

const clickLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productTitle: {
      type: String,
    },

    productUrl: {
      type: String,
    },

    source: {
      type: String,
    },

    priceAtClick: {
      type: Number,
    },

    currency: {
      type: String,
    },

    region: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ClickLog = mongoose.model("ClickLog", clickLogSchema);
