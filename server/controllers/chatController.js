const Chat = require("../models/Chat")
const { encrypt } = require("../utils/encryption")

const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user._id },
      ],
    })
      .populate("sender", "email role")
      .populate("receiver", "email role")
      .sort({ timestamp: 1 })

    const response = encrypt({ messages })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body

    const chat = new Chat({
      sender: req.user._id,
      receiver: receiverId,
      message,
    })

    await chat.save()
    await chat.populate("sender", "email role")
    await chat.populate("receiver", "email role")

    const response = encrypt({
      message: "Message sent successfully",
      chat,
    })
    res.status(201).json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

module.exports = {
  getMessages,
  sendMessage,
}
