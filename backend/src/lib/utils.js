import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken =(userId, res) =>{
  // console.log("env jwt is",ENV.JWT_SECRET)
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
    // sameSite: "none",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    secure: ENV.NODE_ENV === "development" ? false: true,
    // secure: false,
  })
  // console.log("re.cookies is ",res.cookie); // should show jwt token


  return token;
}