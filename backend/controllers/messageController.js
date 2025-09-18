const Message = require("../models/Message");
const mqttClient = require("../services/mqttClient");

const saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderName } = req.body;
    const newMessage = new Message({
      senderId,
      senderName,
      receiverId,
      message,
    });
    await newMessage.save();

    const sortedIds = [String(senderId), String(receiverId)].sort();
    const privateChannel = `private-chat/${sortedIds[0]}/${sortedIds[1]}`;

    const payload = {
      senderId,
      receiverId,
      message,
      senderName,
    };
    mqttClient.publish(privateChannel, JSON.stringify(payload));

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessageHistory = async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveMessage,
  getMessageHistory,
};
