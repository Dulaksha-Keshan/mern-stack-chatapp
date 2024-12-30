import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers : async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages : async (userToChatId) => {
        set({ isMessagesLoading: true }); 
        try {
            const res = await axiosInstance.get(`/messages/${userToChatId}`);

            set({ messages: res.data }); 
            

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false }); 
        }
    },
    sendMessages: async (MessageData) => {
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, MessageData);
            console.log(res.data);
            set({ messages: [...messages, res.data] });

        } catch (error) {
            toast.error(error.response.data.message);
        };

    },
    subscribeToMessages: () => {
        const {selectedUser} = get();

        if(!selectedUser) return

        const socket =  useAuthStore.getState().socket;
        //todo:optimize later
        socket.on("newMessage",(newMessage) => {
            if(selectedUser._id !== newMessage.senderId) return 
            set({ messages: [...get().messages, newMessage] });
        })

        
    },

    unSubscribeFromMessages: () => {
        const socket =  useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser) => {
        set({ selectedUser: selectedUser });
    },
}));  