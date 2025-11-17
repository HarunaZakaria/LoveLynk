import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api';

interface ChatState {
  chats: any[];
  activeChat: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk(
  'chats/fetch',
  async () => {
    const response = await chatApi.getChats();
    return response;
  }
);

export const fetchChat = createAsyncThunk(
  'chats/fetchOne',
  async (matchId: string) => {
    const response = await chatApi.getChat(matchId);
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      if (state.activeChat) {
        state.activeChat.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.activeChat = action.payload;
      });
  },
});

export const { setActiveChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

