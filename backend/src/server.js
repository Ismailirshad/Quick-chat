import express from 'express'
import authRoute from './routes/authRoute.js'
import messageRoute from './routes/messageRoute.js'
import path from 'path'
import mongoose from 'mongoose'
import { ENV } from './lib/env.js'
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from './lib/socket.js'

const __dirname = path.resolve();

const PORT = ENV.PORT
const MONGODB_URI = ENV.MONGODB_URI

app.use(express.json({limit:"5mb"}));
app.use(cors({ origin: "http://localhost:5173", credentials: true, }))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)

// make ready for deployment 
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Database connected")
        server.listen(PORT, () => {
            console.log("server started ", PORT)
        })
    }).catch((error) => {
        console.log("Error in connected to Database", error)
    })
