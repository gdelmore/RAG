// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import chatReducer from './slices/chatSlice';
import dashboardReducer from './slices/dashboardSlice';
import fileReducer from './slices/fileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    chat: chatReducer,
    dashboard: dashboardReducer,
    files: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types for non-serializable data
        ignoredActions: [
          'files/uploadFile/pending',
          'files/uploadFile/fulfilled',
          'files/uploadFile/rejected',
        ],
      },
    }),
});

export default store;
