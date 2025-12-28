import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { create } from "zustand"
import toast from "react-hot-toast";

const notificationSound = new Audio("/sounds/notification.mp3");

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
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
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })

        } catch (error) {
            toast.error("Error in fetching messages")
            console.log("Error in getMessagesById", error)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get()
        const { authUser } = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`;

        set({ isSendingMessage: true });

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            status: "sending",
        };

        set(state => ({
            messages: [...state.messages, optimisticMessage],
        }));


        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set(state => ({
                messages: state.messages.map(msg => msg._id === tempId ? { ...res.data, status: "sent" } : msg)
            }))
        } catch (error) {
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== tempId),
            }));
            toast.error(error.response?.data?.message || "something went wrong")
        } finally {
            set({ isSendingMessage: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        if (!socket) return;
        //to prevent duplicate listeners
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return

            const currentMessages = get().messages;
            set({ messages: [...currentMessages, newMessage] })

            if (isSoundEnabled) {
                notificationSound.currentTime = 0
                notificationSound.play().catch((e) => console.log("Audio plat failed", e))
            }
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage")
    }

}))
