import { Message } from "../models/index.js";

export const getMessages = async (req, res) => {
  try {
      const { userId, recipientId, groupId, page = 1, limit = 20 } = req.query;

      let query = {};
      if (userId && recipientId) {
          // One-to-one chat
          query = {
              $or: [
                  { sender: userId, recipient: recipientId },
                  { sender: recipientId, recipient: userId },
              ],
          };
      } else if (groupId) {
          // Group chat
          query = { group: groupId };
      } else {
          return res.status(400).json({
              success: false,
              message: 'Invalid parameters',
          });
      }

      const skip = (page - 1) * limit;
      const messages = await Message.find(query)
          .sort({ timestamp: -1 }) // Sort by timestamp in descending order (newest first)
          .skip(skip)
          .limit(parseInt(limit))
          .populate('sender', 'username')
          .populate('group', 'name');

      return res.status(200).json({
          success: true,
          message: 'Messages fetched successfully',
          data: messages.reverse(), // Reverse to display oldest first in the UI
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Error fetching messages',
          data: error.message,
      });
  }
};