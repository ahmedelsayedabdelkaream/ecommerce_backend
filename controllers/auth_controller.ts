import User from "../model/user_model.js";
import bcrypt from "bcryptjs";
import * as jwtUtils from "../utils/jwt.js";
import type { Request, Response, NextFunction } from "express";
import type { TypedRequest } from "../types/common.js";
import { throwError } from "../utils/errorHandler.js";

interface LoginBody {
  email: string;
  password: string;
}
interface SignUpBody {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
}

export const login = async (
  req: TypedRequest<LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email: email }).select("+password");

    if (!userDoc) {
      throwError("User not found", 400);
    }

    const passwordMatch = await bcrypt.compare(password, userDoc.password);

    if (!passwordMatch) {
      throwError("Incorrect password", 400);
    }

    const accessToken = jwtUtils.generateAccessToken({
      userId: userDoc._id.toString(),
      email: userDoc.email,
      role: userDoc.role,
    });
    let refreshToken = userDoc.refreshToken;
    if (!refreshToken) {
      refreshToken = jwtUtils.generateRefreshToken(userDoc._id.toString());
      userDoc.refreshToken = refreshToken;
      await userDoc.save();
    }
    return res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.body.refreshToken;

  try {
    const payload = jwtUtils.verifyRefreshToken(refreshToken);
    const userId =
      typeof payload === "string"
        ? payload
        : (payload.id ?? payload.userId ?? "");

    console.log(userId, refreshToken);
    const userDoc = await User.findOne({
      _id: userId,
      refreshToken: refreshToken,
    });

    if (!userDoc) {
      throwError("User not found", 400);
    }

    const accessToken = jwtUtils.generateAccessToken({
      userId: userDoc.id.toString(),
      email: userDoc.email,
      role: userDoc.role,
    });

    return res.status(200).json({ accessToken: accessToken });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { otp, password } = req.body;

  try {
    console.log(otp, password);
    const userDoc = await User.findOne({ "otp.otpCode": otp });

    if (!userDoc) {
      throwError("User not found", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    userDoc.password = hashedPassword;
    userDoc.otp = null;
    await userDoc.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const register = async (
  req: TypedRequest<SignUpBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, role } = req.body;

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      throwError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      role: role,
      cart: [],
    });
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp!.otpCode = otpCode;

    user.otp!.expireAt = new Date(Date.now() + 60000);
    user.otp!.purpose = "verifyEmail";
    await user.save();

    return res.status(200).json({
      message: "User registered successfully",
      userId: user._id.toString(),
    });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const completeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, phoneNumber, gender, userId } = req.body;
  const image = req.file?.path;

  if (!image) {
    throwError("no image found", 442);
  }
  const imageUrl = image;
  try {
    const userDoc = await User.findOne({ _id: userId });
    if (!userDoc) {
      throwError("User already exists", 400);
    }

    userDoc.name = name;
    userDoc.phoneNumber = phoneNumber;
    userDoc.gender = gender;
    userDoc.imageUrl = imageUrl;

    await userDoc.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, purpose } = req.body;
  try {
    const userDoc = await User.findOne({ email: email });
    if (!userDoc) {
      throwError("User not found", 400);
    }
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    userDoc.otp!.otpCode = otpCode;
    userDoc.otp!.expireAt = new Date(Date.now() + 60000);
    if (userDoc.otp!.purpose == "verifyEmail") {
      await userDoc.save();
    } else {
      userDoc.otp!.purpose = purpose;
      await userDoc.save();
    }
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const verifyEmailOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  try {
    console.log(email, otp);
    const userDoc = await User.findOne({ email: email });
    if (!userDoc) {
      throwError("User not found", 400);
    }

    if (userDoc.otp!.otpCode !== otp) {
      throwError("Invalid OTP", 400);
    }
    userDoc.otp = null;

    userDoc.emailVerified = true;
    await userDoc.save();

    return res.status(200).json({ message: "success" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const verifyResetPassOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, otp } = req.body;
  try {
    console.log(email, otp);
    const userDoc = await User.findOne({ email: email });
    if (!userDoc) {
      throwError("User not found", 400);
    }

    if (userDoc.otp!.otpCode !== otp) {
      throwError("Invalid OTP", 400);
    }

    return res
      .status(200)
      .json({ message: "success", otp: userDoc.otp?.otpCode });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const logout = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;
  try {
    const userDoc = await User.findOne({ _id: userId });
    if (!userDoc) {
      throwError("User not found", 400);
    }

    userDoc.refreshToken = null;
    await userDoc.save();
    return res.status(200).json({ message: "Logout successful" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
