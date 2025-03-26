// src/components/chat/ChatContainer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMessages, 
  sendMessage, 
  fetchConversation, 
  updateConversationTitle 
} from '../../redux/slices/chatSlice';
import { useTenant } from '../../contexts/TenantContext';
import { Button } from '../common/Button';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { PaperAirplaneIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';

const ChatContainer = ({ conversationId }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { tenant } = useTenant();
  
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  
  const { 
    currentConversation, 
    messages, 
    isLoadingMessages, 
    isSending 
  } = useSelector(state => state.chat);
  
  useEffect(() => {
    if (tenant && conversationId) {
      dispatch(fetchConversation({ 
        tenantId: tenant.id, 
        conversationId 
      }));
      dispatch(fetchMessages({ 
        tenantId: tenant.id, 
        conversationId 
      }));
    }
  }, [dispatch, tenant, conversationId]);
  
  useEffect(() => {
    if (currentConversation) {
      setTitle(currentConversation.title || 'New conversation');
    }
  }, [currentConversation]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    dispatch(sendMessage({
      tenantId: tenant.id,
      conversationId: conversationId || 'new',
      content: message
    }));
    
    setMessage('');
  };
  
  const handleTitleUpdate = () => {
    if (title.trim() && conversationId) {
      dispatch(updateConversationTitle({
        tenantId: tenant.id,
        conversationId,
        title: title.trim()
      }));
    }
    setIsEditing(false);
  };
  
  if (!tenant) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-800">
        {isEditing ? (
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Conversation title"
              autoFocus
            />
            <Button 
              size="sm" 
              onClick={handleTitleUpdate}
            >
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setTitle(currentConversation?.title || 'New conversation');
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mr-2">
              {currentConversation?.title || 'New conversation'}
            </h2>
            {conversationId && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {isLoadingMessages ? (
          <div className="flex justify-center py-8">
            <LoadingIndicator />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' 
                        ? 'text-blue-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatDate(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              disabled={isSending}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isSending}
            isLoading={isSending}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
