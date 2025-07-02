import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userAgent: {
        type: String,
        required: true
    },

    ip: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    },

    isValid: {
        type: Boolean,
        default: false
    },

  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
