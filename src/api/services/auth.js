// src/api/services/auth.js
import axios from '../axiosConfig';

/**
 * Login a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Axios response
 */
export const login = (email, password) => {
  return axios.post('/auth/login', { email, password });
};

/**
 * Login a user with OAuth provider
 * @param {string} provider - OAuth provider (google, microsoft, apple)
 * @param {string} token - OAuth token
 * @returns {Promise} - Axios response
 */
export const loginWithOAuth = (provider, token) => {
  return axios.post('/auth/oauth', { provider, token });
};

/**
 * Register a new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Axios response
 */
export const register = (name, email, password) => {
  return axios.post('/auth/register', { name, email, password });
};

/**
 * Send a password reset link to the user's email
 * @param {string} email - User email
 * @returns {Promise} - Axios response
 */
export const forgotPassword = (email) => {
  return axios.post('/auth/forgot-password', { email });
};

/**
 * Reset user password with token
 * @param {string} token - Reset password token
 * @param {string} password - New password
 * @returns {Promise} - Axios response
 */
export const resetPassword = (token, password) => {
  return axios.post('/auth/reset-password', { token, password });
};

/**
 * Refresh authentication token
 * @returns {Promise} - Axios response
 */
export const refreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return axios.post('/auth/refresh-token', { refreshToken });
};

/**
 * Logout user
 * @returns {Promise} - Axios response
 */
export const logout = () => {
  return axios.post('/auth/logout');
};
