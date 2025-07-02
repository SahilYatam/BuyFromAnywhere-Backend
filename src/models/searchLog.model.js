import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    query: {
        type: String
    },

    filters: {
        priceRange: {
            type: Number,
        },
        rating: {
            type: Number
        },
        source: {
            type: String,
        }
    },

    resultsCount: {
        type: Number,
    },

    region: {
        type: String,
    }

  },
  { timestamps: true }
);


export const SearchLog = mongoose.model("SearchLog", searchLogSchema);