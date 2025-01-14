import UserModel from "../Models/UserModel.js";
import mongoose from 'mongoose';

// Controller to get user data by user ID
export const getUserData = async (req, res) => {
  const { userId } = req.params;
  console.log('Requested User ID:', userId);

  // Check if userId is a valid ObjectId string
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Query for the user using the userId as ObjectId
    const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    console.log('User retrieved:', user);

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data as a response
    res.status(200).json(user);
  } catch (error) {
    // Log error and send it as response
    console.log('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};
