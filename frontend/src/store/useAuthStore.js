import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : window.location.origin;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSignup: false,
    isLogingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check", { withCredentials: true })
            set({ authUser: res.data })
            get().connectSocket();
        } catch (error) {
            console.log("Error in authCheck", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSignup: true })
        try {
            const res = await axiosInstance.post("auth/signup", data, { withCredentials: true });
            // Update the store with the returned user
            set({ authUser: res.data.user });
            toast.success("Acccount created successfully")
            get().connectSocket();
        } catch (error) {
            console.log("Error in signup", error)
            toast.error("signup error", error)
        } finally {
            set({ isSignup: false })
        }
    },

    login: async (data) => {
        set({ isLogingIn: true })
        try {
            const res = await axiosInstance.post("auth/login", data, { withCredentials: true });
            // Update the store with the returned user
            set({ authUser: res.data.user });
            toast.success("Logged in successfully")
            get().connectSocket();
        } catch (error) {
            toast.error("login error", error)
        } finally {
            set({ isLogingIn: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("auth/logout", {}, { withCredentials: true });
            set({ authUser: null })
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error("Failed to log out")
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("auth/updateProfile", data, { withCredentials: true });
            set({ authUser: res.data });
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Erro in profile updated", error)
            toast.error("Failed to update profile")
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            transports: ["websocket"],
            withCredentials: true,  //this ensures cookies are sent with the connection
        })
        socket.connect();

        set({ socket })

        // listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connect) get().socket.disconnect();
    },
}))

