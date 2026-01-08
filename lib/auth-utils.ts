import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "default_dev_secret";
const TOKEN_NAME = "auth_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const createToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const setAuthCookie = (token: string) => {
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  return cookie;
};

export const removeAuthCookie = () => {
  const cookie = serialize(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });

  return cookie;
};

export const getUserFromRequest = (req: NextRequest) => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const token = cookies[TOKEN_NAME];

  if (!token) return null;

  return verifyToken(token);
};
