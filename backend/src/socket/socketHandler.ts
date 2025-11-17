import { Socket, Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const socketHandler = (socket: AuthenticatedSocket, io: Server) => {
  // Authenticate socket connection
  socket.on('authenticate', async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        socket.userId = decoded.userId;
        socket.join(`user:${decoded.userId}`);
        socket.emit('authenticated', { success: true });
      } else {
        socket.emit('authenticated', { success: false, message: 'User not found' });
      }
    } catch (error) {
      socket.emit('authenticated', { success: false, message: 'Invalid token' });
    }
  });

  // Swipe event
  socket.on('swipe', async (data: { swipedId: string; action: string; compatibilityScore: number }) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      // Handle swipe logic
      // Emit to swiped user if it's a like
      if (data.action === 'like' || data.action === 'superSwipe') {
        io.to(`user:${data.swipedId}`).emit('new_like', {
          userId: socket.userId,
          preview: 'Someone liked you!',
          action: data.action,
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to process swipe' });
    }
  });

  // Join match room
  socket.on('join_match_room', (data: { matchId: string }) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }
    socket.join(`match:${data.matchId}`);
  });

  // Leave match room
  socket.on('leave_match_room', (data: { matchId: string }) => {
    socket.leave(`match:${data.matchId}`);
  });

  // Send message
  socket.on('send_message', async (data: { matchId: string; content: string; type: string; audioUrl?: string }) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      const message = {
        _id: `temp_${Date.now()}`,
        senderId: socket.userId,
        content: data.content,
        type: data.type || 'text',
        audioUrl: data.audioUrl,
        readBy: [],
        reactions: [],
        createdAt: new Date(),
      };

      io.to(`match:${data.matchId}`).emit('new_message', {
        message,
        matchId: data.matchId,
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data: { matchId: string; isTyping: boolean }) => {
    if (!socket.userId) return;

    socket.to(`match:${data.matchId}`).emit('typing_indicator', {
      matchId: data.matchId,
      userId: socket.userId,
      isTyping: data.isTyping,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
};

export default socketHandler;

