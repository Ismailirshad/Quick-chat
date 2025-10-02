import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ messsage: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ messsage: "Password must be at least 6 characters" })
        }

        //check if emails are valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ messsage: "Invalid email format" })
        }

        const user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ messsage: "Emails already exists" })

        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
            try{
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            }catch(error){
          console.error("Failed to send welcome email:", error)
            }
        } else {
            res.status(400).json({ messsage: "invalid user data" })
        }
    } catch (error) {
        console.log("Error i signup", error)
        res.status(500).json({ messsage: "Internal server err" })
    }

}