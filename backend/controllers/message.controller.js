import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMsg = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        // if no conversation is found, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMsg = await Message.create({
            senderId,
            receiverId,
            message
        })

        if (newMsg) {
            conversation.messages.push(newMsg._id)
        }

        // await conversation.save()
        // await newMsg.save()
        // this wil run both of the above at the same time
        await Promise.all([conversation.save(), newMsg.save()])

        // socket io functionality to be added here
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            // io.to(<socketId>).emit(<eventName>, <data>) sends an event to a specific client
            io.to(receiverSocketId).emit("newMessage", newMsg)
        }
        res.status(201).json(newMsg)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getMsgs = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages')

        if (!conversation) {
            return res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}