// src/redux/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation as deleteConversationApi,
  getMessages,
  sendMessage as sendMessageApi,
} from '../../api/services/chat';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async ({ tenantId }, { rejectWithValue }) => {
    try {
      const response = await getConversations(tenantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch conversations' });
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async ({ tenantId, conversationId }, { rejectWithValue }) => {
    try {
      const response = await getConversation(tenantId, conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch conversation' });
    }
  }
);

export const updateConversationTitle = createAsyncThunk(
  'chat/updateConversationTitle',
  async ({ tenantId, conversationId, title }, { rejectWithValue }) => {
    try {
      const response = await updateConversation(tenantId, conversationId, { title });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update conversation' });
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async ({ tenantId, conversationId }, { rejectWithValue }) => {
    try {
      await deleteConversationApi(tenantId, conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete conversation' });
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ tenantId, conversationId }, { rejectWithValue }) => {
    try {
      const response = await getMessages(tenantId, conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch messages' });
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ tenantId, conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(tenantId, conversationId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to send message' });
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
    resetChat: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.payload?.message || 'Failed to fetch conversations';
      })
      
      // Fetch Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.payload?.message || 'Failed to fetch conversation';
      })
      
      // Update Conversation Title
      .addCase(updateConversationTitle.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
        const index = state.conversations.findIndex(conv => conv.id === action.payload.id);
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
      })
      
      // Delete Conversation
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(conv => conv.id !== action.payload);
        if (state.currentConversation?.id === action.payload) {
          state.currentConversation = null;
          state.messages = [];
        }
      })
      
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload?.message || 'Failed to fetch messages';
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        
        // If this is a new conversation, update state with the newly created conversation
        if (action.payload.conversation) {
          state.currentConversation = action.payload.conversation;
          state.conversations.unshift(action.payload.conversation);
        }
        
        // Add the new messages to the chat
        if (action.payload.messages) {
          state.messages = [...state.messages, ...action.payload.messages];
        } else if (action.payload.message) {
          state.messages.push(action.payload.message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload?.message || 'Failed to send message';
      });
  },
});

export const { clearChatError, resetChat } = chatSlice.actions;

export default chatSlice.reducer;
