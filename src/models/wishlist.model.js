import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
    },

    image: {
      type: String,
    },

    productUrl: {
      type: String,
    },

    source: {
      type: String,
    },

    priceAtSave: {
      type: Number,
    },

    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);