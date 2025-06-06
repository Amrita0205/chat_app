// Install bcrypt: npm install bcrypt
import bcrypt from 'bcrypt';
import {User} from '../models/index.js';

// In registerUser
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      data: error.message,
    });
  }
};

// In loginUser
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    return res.status(200).json({ success: true, message: 'User logged in successfully', data: user });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ success: false, message: 'Internal Server error', data: error.message });
  }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username _id');
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching users',
            data: error.message,
        });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.query.userId; // In a real app, get this from auth middleware
        const user = await User.findById(userId).populate('groups', 'name _id');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Groups fetched successfully',
            data: user.groups,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching groups',
            data: error.message,
        });
    }
};