import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  emailVeried: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  password: string;
  refreshToken: string;
  role: "user" | "admin";
  cart: {
    items: [
      {
        productId: mongoose.Types.ObjectId;
        quantity: number;
      },
    ];
  };
}

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    otp: {
      otpCode: { type: String },
      expireAt: { type: Date },
      purpose: { type: String, enum: ["verifyEmail", "resetPassword"] },
    },

    phoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
