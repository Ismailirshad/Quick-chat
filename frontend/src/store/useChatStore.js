import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

const notificationSound = new Audio("/sounds/notification.mp3");

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/message/contacts", { withCredentials: true })
            set({ allContacts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in authCheck", error)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getAllChatParnters: async () => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get("/message/chats")
            set({ chats: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoadig: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })

        } catch (error) {
            toast.error("Error in fetching messages")
            console.log("Error in getMessagesById", error)
        } finally {
            set({ isMessagesLoadig: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        const {authUser} = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`;
     
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            recieverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOpstimistic: true,
        };

        set({messages : [...messages, optimisticMessage]})

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: messages.concat(res.data) })
        } catch (error) {
            set({messages: messages })
            toast.error(error.response?.data?.message || "something went wrong")
        }
    },

    subscribeToMessages: () => {
        const {selectedUser, isSoundEnabled} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
           const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
           if(!isMessageSentFromSelectedUser) return

            const currentMessages = get().messages;
            set({messages: [...currentMessages, newMessage]})

            if(isSoundEnabled) {
                notificationSound.currentTime = 0
                notificationSound.play().catch((e) => console.log("Audio plat failed", e))
            }
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    }

}))
