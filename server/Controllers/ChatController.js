import ChatModel from "../Models/ChatModel.js";

// Backend (adjusting to match frontend request keys)
export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("Received senderId:", senderId);
  console.log("Received receiverId:", receiverId);

  if (!senderId || !receiverId) {
    return res.status(400).send("Both senderId and receiverId are required.");
  }

  try {
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    await newChat.save();
    res.status(200).send(newChat);
  } catch (error) {
    console.log("Error creating chat:", error);
    res.status(500).send("Error creating chat");
  }
};


export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat); // Send status and data in a single call
  } catch (error) {
    res.status(500).json(error); // Send status and error in a single call
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat); // Send status and data in a single call
  } catch (error) {
    res.status(500).json(error); // Send status and error in a single call
  }
};
