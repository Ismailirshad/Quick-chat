import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        // extract token from http-only cookies 
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1]

        if (!token) {
            console.log("socket connection rejected: No token provided")
            return next(new Error("Unauthorized - No Token Provided"))
        }

        // verify the token
        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) {
            console.log("socket connection rejected: Invalid token")
            return next(new Error("Unauthorized - Invalid Token"))
        }

        // find user fromdb
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            console.log("socket connection rejected: User not found")
            return next(new Error("User not found"))
        }

        // attach user info to socket 
        socket.user = user
        socket.userId = user._id.toString()

        console.log(`Socket authentication for user: ${user.fullName} (${user._id})`)

        next()
    } catch (error) {
        console.log("Error in socketAuth middleware", error.message)
        next(new Error("Unauthorized - authentication failed"))
        // res.status(500).json({ message: "Internal server error" })
    }
}