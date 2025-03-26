// src/api/services/chat.js
import axios from '../axiosConfig';

/**
 * Get all conversations for a tenant
 * @param {string} tenantId - Tenant ID
 * @returns {Promise} - Axios response
 */
export const getConversations = (tenantId) => {
  return axios.get(`/tenants/${tenantId}/conversations`);
};

/**
 * Get a specific conversation by ID
 * @param {string} tenantId - Tenant ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response
 */
export const getConversation = (tenantId, conversationId) => {
  return axios.get(`/tenants/${tenantId}/conversations/${conversationId}`);
};

/**
 * Create a new conversation
 * @param {string} tenantId - Tenant ID
 * @param {Object} data - Conversation data (title, initialMessage, etc.)
 * @returns {Promise} - Axios response
 */
export const createConversation = (tenantId, data) => {
  return axios.post(`/tenants/${tenantId}/conversations`, data);
};

/**
 * Update an existing conversation
 * @param {string} tenantId - Tenant ID
 * @param {string} conversationId - Conversation ID
 * @param {Object} data - Updated conversation data
 * @returns {Promise} - Axios response
 */
export const updateConversation = (tenantId, conversationId, data) => {
  return axios.patch(`/tenants/${tenantId}/conversations/${conversationId}`, data);
};

/**
 * Delete a conversation
 * @param {string} tenantId - Tenant ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response
 */
export const deleteConversation = (tenantId, conversationId) => {
  return axios.delete(`/tenants/${tenantId}/conversations/${conversationId}`);
};

/**
 * Get all messages for a conversation
 * @param {string} tenantId - Tenant ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response
 */
export const getMessages = (tenantId, conversationId) => {
  return axios.get(`/tenants/${tenantId}/conversations/${conversationId}/messages`);
};

/**
 * Send a message in a conversation
 * @param {string} tenantId - Tenant ID
 * @param {string} conversationId - Conversation ID or 'new' for a new conversation
 * @param {Object} data - Message data (content, attachments, etc.)
 * @returns {Promise} - Axios response
 */
export const sendMessage = (tenantId, conversationId, data) => {
  if (conversationId === 'new') {
    // Create a new conversation with the initial message
    return createConversation(tenantId, { ...data, createThread: true });
  } else {
    // Add a message to an existing conversation
    return axios.post(
      `/tenants/${tenantId}/conversations/${conversationId}/messages`,
      data
    );
  }
};
