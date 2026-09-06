import type { CustomError } from "../types/common.js";

export function throwError(
  error: string,
  statusCode: number,
  data?: any,
): never {
  const customError = new Error(error) as CustomError;
  customError.statusCode = statusCode;
  customError.data = data;
  throw customError;
}
