import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchChat, addMessage } from '../store/slices/chatSlice';
import { chatApi } from '../services/api';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import { useAppDispatch } from '../hooks/useAppDispatch';

const ChatPage = () => {
  const { matchId } = useParams();
  const dispatch = useAppDispatch();
  const { activeChat } = useSelector((state: RootState) => state.chats);
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (matchId) {
      dispatch(fetchChat(matchId));
    }

    // Initialize socket
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      const token = localStorage.getItem('token');
      if (token) {
        socket.emit('authenticate', token);
      }
      if (matchId) {
        socket.emit('join_match_room', { matchId });
      }
    });

    socket.on('authenticated', (data: { success: boolean; message?: string }) => {
      if (!data.success) {
        console.error('Socket authentication failed:', data.message);
      }
    });

    socket.on('new_message', (data: any) => {
      dispatch(addMessage(data.message));
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [matchId, dispatch]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !matchId) return;

    try {
      const newMessage = await chatApi.sendMessage(matchId, { content: message });
      dispatch(addMessage(newMessage));
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-purple"></div>
      </div>
    );
  }

  const currentUserId = user?._id || localStorage.getItem('userId');

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {activeChat.messages?.map((msg: any) => {
          const senderId =
            typeof msg.senderId === 'string'
              ? msg.senderId
              : msg.senderId?._id || msg.senderId?.toString();
          const isOwn = senderId === currentUserId;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-cosmic-gradient text-white'
                    : 'bg-cosmic-slate text-gray-100'
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-4 border-t border-cosmic-purple/20">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;

