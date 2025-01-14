import UserModel from "../Models/UserModel.js";

// Controller to get all users' data
export const getAllUsersData = async (req, res) => {
  try {
    // Query to get all users from the database
    const users = await UserModel.find({});
    console.log('All users retrieved:', users);

    // Check if any users were found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send the users data as a response
    res.status(200).json(users);
  } catch (error) {
    // Log error and send it as response
    console.log('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};
