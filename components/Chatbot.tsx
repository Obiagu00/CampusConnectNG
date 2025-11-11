
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon, UserIcon, BotIcon } from './IconComponents';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Hello! I am CampusConnect AI. How can I help you find what you need today? 🎓',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const response = await getChatbotResponse(newMessages, userInput);

    setMessages([...newMessages, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Toggle Chatbot"
        >
          {isOpen ? <CloseIcon className="h-8 w-8" /> : <ChatIcon className="h-8 w-8" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-blue-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right">
          <header className="bg-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <h3 className="text-lg font-bold">CampusConnect AI</h3>
          </header>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-blue-950">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 my-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="bg-gray-200 dark:bg-blue-800 p-2 rounded-full"><BotIcon className="w-6 h-6 text-indigo-500" /></div>}
                <div className={`px-4 py-2 rounded-2xl max-w-xs break-words ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-blue-800 text-gray-800 dark:text-blue-200 rounded-bl-none'}`}>
                   {msg.text}
                </div>
                {msg.role === 'user' && <div className="bg-gray-200 dark:bg-blue-800 p-2 rounded-full"><UserIcon className="w-6 h-6 text-gray-600 dark:text-blue-300" /></div>}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 my-3 justify-start">
                  <div className="bg-gray-200 dark:bg-blue-800 p-2 rounded-full"><BotIcon className="w-6 h-6 text-indigo-500" /></div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-blue-800 rounded-bl-none flex items-center space-x-2">
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-blue-700 bg-white dark:bg-blue-900 rounded-b-2xl">
            <div className="flex items-center bg-gray-100 dark:bg-blue-800 rounded-full">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-transparent p-3 focus:outline-none text-gray-800 dark:text-blue-200 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-full m-1 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                disabled={isLoading || !userInput.trim()}
                aria-label="Send Message"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
