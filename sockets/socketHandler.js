import { Message, User, Group } from '../models/index.js';

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user is connected: ', socket.id);

        socket.on('joinChat', ({ userId, recipientId }) => {
            const roomId = [userId, recipientId].sort().join('-');
            socket.join(roomId);
            console.log(`User ${userId} joined one-to-one chat room: ${roomId}`);
        });

        socket.on('joinGroup', ({ groupId }) => {
            socket.join(groupId);
            console.log(`User joined group chat room: ${groupId}`);
        });

        socket.on('sendMessage', async ({ senderId, recipientId, content }) => {
            try {
                const sender = await User.findById(senderId);
                const recipient = await User.findById(recipientId);

                if (!sender || !recipient) {
                    console.error('Sender or recipient not found');
                    return;
                }

                const message = new Message({
                    sender: senderId,
                    recipient: recipientId,
                    content,
                    timestamp: new Date(),
                });
                await message.save();

                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'username')
                    .lean();

                const roomId = [senderId, recipientId].sort().join('-');
                io.to(roomId).emit('message', populatedMessage);
            } catch (error) {
                console.error('Error sending one-to-one message:', error.message);
            }
        });

        socket.on('sendGroupMessage', async ({ senderId, groupId, content }) => {
            try {
                const sender = await User.findById(senderId);
                const group = await Group.findById(groupId);

                if (!sender || !group) {
                    console.error('Sender or group not found');
                    return;
                }

                if (!group.members.includes(senderId)) {
                    console.error('Sender is not a member of the group');
                    return;
                }

                const message = new Message({
                    sender: senderId,
                    group: groupId,
                    content,
                    timestamp: new Date(),
                });
                await message.save();

                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'username')
                    .lean();

                io.to(groupId).emit('message', populatedMessage);
            } catch (error) {
                console.error('Error sending group message:', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};