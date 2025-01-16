// authController.js
import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModel.js';

const JWT_SECRET = 'd1c69ba60b6a437fc42b94ef9b06b8f42a7b93e9383d0320bcfb7d5426a8e02f'; // Secret key for signing JWT

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Send response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { _id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
