import { sign, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export function generateToken(payload: any) {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }
  return sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }
  return verify(token, process.env.JWT_SECRET, {
    issuer: "Senai",
  });
}
