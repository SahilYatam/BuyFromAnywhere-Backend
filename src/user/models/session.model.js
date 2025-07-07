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

    createdAt: { 
        type: Date,
        default: Date.now, 
        expires: 60 * 60 * 24 * 7 
    } // auto-delete after 7 days

  },
  { timestamps: true }
);

/**
 * 
 * @param {mongoose.connection} connection 
 * @returns {mongoose.Model<mongoose.Document>}
 */

export const sessionModel = (connection) => connection.model("Session", sessionSchema);
