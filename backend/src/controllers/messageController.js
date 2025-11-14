import User from "../models/User.js";
import Message from "../models/Message.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getAllContacts", error)
        res.status(500).json({ message: "server error" })
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controlelr", error)
        res.status(500).json({ message: "Internal error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Message must have either text or an image" });
        }
        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send message to yourself" });
        }
        const recieverExits = await User.exists({ _id: receiverId });
        if (!recieverExits) {
            return res.status(404).json({ message: "Reciever not found" });
        }
        
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await newMessage.save();

        //todo: send message in realtime if user in online -socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error)
        res.status(500).json({ message: "Internal error" })
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        //find all messages where sender or reciever is loggedIn user
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        });

        const ChatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()
                )
            )
        ]
        const chatParnters = await User.find({ _id: { $in: ChatPartnerIds } }).select("-password")
        res.status(200).json(chatParnters)
    } catch (error) {
        console.log("Erro in getAllChats", error)
        res.status(500).json({ message: "Internal server error" })
    }
}