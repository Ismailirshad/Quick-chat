import express from 'express'
import { signup, login, logout, updateProfile } from '../controllers/authController.js';
import {protectRoute} from "../middleware/authMiddleware.js"
import { arcjetProtection } from '../middleware/arcjetMiddleware.js';

const router = express.Router();
router.use(arcjetProtection);
router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user))
router.post('/signup',signup)
router.post('/logout',logout)
router.post('/login',login)
router.put('/updateProfile', protectRoute, updateProfile)

export default router;