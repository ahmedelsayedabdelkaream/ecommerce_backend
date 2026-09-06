import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { throwError } from "../utils/errorHandler.js";
import type { TypedRequest } from "../types/common.js";

const isAuth = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throwError("Not authenticated", 401);
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throwError("Malformed Authorization header", 401);
  }

  let decodedToken: any;
  try {
    const token = parts[1]!;
    decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN!);

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (_err) {
    throwError("Token expired or invalid", 401);
  }
  if (!decodedToken) {
    throwError("Not authenticated", 401);
  }
  req.userId = decodedToken.userId;
  next();
};

export default isAuth;
