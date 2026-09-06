import type { Request } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

export interface TypedRequest<B = any, P = any, Q = any> extends Request<
  P,
  any,
  B,
  Q
> {
  userId: any;
  body: B;
  params: P;
  query: Q;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success: boolean;
}
