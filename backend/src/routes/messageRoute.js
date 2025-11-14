import express from 'express'
import { protectRoute } from '../middleware/authMiddleware.js';
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from '../controllers/messageController.js';

const router = express.Router()

router.get('/contacts', protectRoute, getAllContacts);
router.get('/chats',protectRoute, getChatPartners);
router.get('/:id',protectRoute, getMessagesByUserId);
router.post('/send/:id',protectRoute, sendMessage)

router.get('/send', (req, res)=>{
    res.status(200).send("message route")
})

export default router