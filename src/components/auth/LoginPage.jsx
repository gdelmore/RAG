// src/components/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, loginWithOAuth, clearAuthError } from '../../redux/slices/authSlice';
import { EmailPasswordForm } from './EmailPasswordForm';
import { OAuthLoginButton } from './OAuthLoginButton';
import AiriamLogo from '../../assets/images/airiam-logo.svg';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    // Clear any previous auth errors when component mounts
    dispatch(clearAuthError());
  }, [dispatch]);
  
  useEffect(() => {
    // Show error if it exists
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  const handleLoginSubmit = (formData) => {
    const { email, password } = formData;
    dispatch(login({ email, password }));
  };
  
  const handleOAuthLogin = (provider) => {
    // In a real implementation, this would open an OAuth popup or redirect
    // For now, we'll just simulate the OAuth flow by directly calling the action
    console.log(`OAuth login with ${provider}`);
    
    // Mocked token - in reality, this would come from the OAuth provider
    const mockToken = 'mock-oauth-token';
    
    dispatch(loginWithOAuth({ provider, token: mockToken }));
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src={AiriamLogo}
          alt="Airiam"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showError && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <EmailPasswordForm onSubmit={handleLoginSubmit} isRegistration={false} />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <OAuthLoginButton 
                provider="google" 
                onClick={() => handleOAuthLogin('google')} 
              />
              <OAuthLoginButton 
                provider="microsoft" 
                onClick={() => handleOAuthLogin('microsoft')} 
              />
              <OAuthLoginButton 
                provider="apple" 
                onClick={() => handleOAuthLogin('apple')} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
