import express from 'express'
import { signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup',signup)

router.get('/login', (req, res) =>{
    res.status(200).send("logine dnpoint")
})

export default router;