import UserModel from "../Models/UserModel.js";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Controller function to add a new user
export const addUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

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
