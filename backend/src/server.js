import express from 'express'
import authRoute from './routes/authRoute.js'
import messageRoute from './routes/messageRoute.js'
import path from 'path'
import mongoose from 'mongoose'
import { ENV } from './lib/env.js'

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT
const MONGODB_URI= ENV.MONGODB_URI

app.use(express.json()); //req.body

app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)

// make ready for deployment 
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_,res) =>{
        res.sendFile(path.join(__dirname, "../frontend", "dist" , "index.html"))
    })
}

mongoose.connect(MONGODB_URI)
   .then(()=>{
    console.log("Database connected")
    app.listen(PORT, () =>{
    console.log("server started ",PORT)
})
   }).catch((error) =>{
   console.log("Error in connected to Database", error)
   })
