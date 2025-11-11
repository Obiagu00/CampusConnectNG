
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, User } from '../types';
import { CloseIcon, SendIcon } from './IconComponents';

interface ChatViewProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => void;
  onClose: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, currentUser, onSendMessage, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUser = conversation.seller.id === currentUser.id ? conversation.buyer : conversation.seller;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSendMessage(conversation.id, userInput);
    setUserInput('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-blue-900 rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col">
        <header className="p-4 border-b border-gray-200 dark:border-blue-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-blue-800 rounded-full flex items-center justify-center font-bold text-indigo-600">
                    {otherUser.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-blue-200">{otherUser.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-blue-400">Seller</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-blue-200">
                <CloseIcon className="h-6 w-6" />
            </button>
        </header>

        <div className="p-4 border-b border-gray-200 dark:border-blue-700 bg-gray-50 dark:bg-blue-950 flex items-center space-x-3">
            <img src={conversation.productImageUrl} alt={conversation.productName} className="w-12 h-12 object-cover rounded-md"/>
            <div>
                <p className="text-sm text-gray-500 dark:text-blue-400">Inquiry about:</p>
                <p className="font-semibold text-gray-800 dark:text-blue-200">{conversation.productName}</p>
            </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {conversation.messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 my-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== currentUser.id && (
                <div className="w-8 h-8 bg-gray-200 dark:bg-blue-800 rounded-full flex items-center justify-center font-bold text-sm text-indigo-600">
                    {otherUser.name.charAt(0)}
                </div>
              )}
              <div className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-sm ${
                msg.senderId === currentUser.id 
                ? 'bg-indigo-500 text-white rounded-br-none' 
                : 'bg-gray-200 dark:bg-blue-800 text-gray-800 dark:text-blue-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-blue-700">
            <div className="flex items-center bg-gray-100 dark:bg-blue-800 rounded-full">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-transparent p-3 focus:outline-none text-gray-800 dark:text-blue-200 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-full m-1 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                disabled={!userInput.trim()}
                aria-label="Send Message"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
