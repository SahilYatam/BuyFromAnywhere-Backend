import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 character long"],
    },

    region: {
        type: String,
        required: true
    },

    currency: {
        type: String,
        required: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    }

  },
  { timestamps: true }
);

export const User = (connection) => connection.model("User", userSchema);
