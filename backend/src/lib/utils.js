import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken =(userId, res) =>{
   if (!ENV.JWT_SECRET) {
    console.error("JWT_SECRET is undefined!");
    return;
  }
  const token = jwt.sign({userId}, ENV.JWT_SECRET, {
    expiresIn: "7d",
  })

  res.cookie("jwt", token, {
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    secure: ENV.NODE_ENV === "development" ? false: true,
  })

  return token;
}