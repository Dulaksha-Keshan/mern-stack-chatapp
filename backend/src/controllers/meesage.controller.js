import User from "../models/users.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js"

import { getreceiverSocketId ,io} from "../lib/socket.js"

export const getUsersForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in the getUsersForSidebar controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const getMessages = async (req,res) =>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[{senderId:userToChatId,receiverId:myId},
                {senderId:myId,receiverId:userToChatId}]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in the getMessages controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} =  req.params;
        const senderId = req.user._id;


        let imageUrl;
        if(image){
            //upload it to the cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save();

        const receiverSocketId = getreceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(`Error in the sendMessage controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
}