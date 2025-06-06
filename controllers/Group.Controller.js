import mongoose from 'mongoose';
import { Group, User } from '../models/index.js';

export const CreateGroup = async (req, res) => {
    try {
        const { name, memberIds } = req.body;

        // Validate input
        if (!name || !memberIds || !Array.isArray(memberIds)) {
            return res.status(400).json({
                success: false,
                message: 'Name and memberIds are required, and memberIds must be an array',
            });
        }

        // Convert memberIds to mongoose.Types.ObjectId
        let convertedMemberIds;
        try {
            convertedMemberIds = memberIds.map(id => {
                // Validate if the ID is a valid ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid ObjectId: ${id}`);
                }
                return new mongoose.Types.ObjectId(id); // Use mongoose.Types.ObjectId
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'One or more memberIds are invalid ObjectIds',
                data: error.message
            });
        }

        // Check if all users exist
        const users = await User.find({ _id: { $in: convertedMemberIds } });
        if (users.length !== memberIds.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more users not found',
            });
        }

        // Create the group with converted memberIds
        const group = new Group({ name, members: convertedMemberIds });
        await group.save();

        // Update users' groups array
        await User.updateMany(
            { _id: { $in: convertedMemberIds } },
            { $push: { groups: group._id } }
        );

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: group
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: error.message
        });
    }
};