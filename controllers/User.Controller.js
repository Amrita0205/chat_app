import {User} from '../models/index.js';

export const registerUser =async(req,res)=>{
    
    try{
        const{username, password}=req.body;
        const user=new User({username,password});
        await user.save();
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            data:user
        });
    }catch(error)
    {
        return res.status(500).json({
            success:true,
            message:"Internal Server error",
            data:error.message
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request:', { username });

        // Validate input
        if (!username || !password) {
            console.log('Validation failed: Username or password missing');
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
            });
        }

        // Check if user exists
        console.log('Checking for user:', username);
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        // Compare passwords (plain text comparison since bcrypt is not used)
        console.log('Verifying password for user:', username);
        if (user.password !== password) {
            console.log('Password mismatch for user:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        console.log('User logged in successfully:', username);
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: user,
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server error',
            data: error.message,
        });
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