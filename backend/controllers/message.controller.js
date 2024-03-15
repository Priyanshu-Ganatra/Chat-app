import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMsg = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // console.log(senderId, receiverId, message);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

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

        // socket io functionality to be added here

        // await conversation.save()
        // await newMsg.save()

        // this wil run both of the above at the same time
        await Promise.all([conversation.save(), newMsg.save()])
        res.status(201).json({ "message": newMsg })
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            return res.status(200).json({ message: "No conversation found" })
        }

        const messages = conversation.messages

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}