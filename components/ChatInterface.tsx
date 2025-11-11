import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
  history: ChatMessage[];
  isReplying: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isReplying, onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isReplying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isReplying && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-96">
      <h3 className="text-md font-semibold text-gray-700 mb-2 flex-shrink-0">
        {disabled ? 'Consultation History' : 'Follow-up Questions'}
      </h3>
      <div className="flex-grow overflow-y-auto space-y-4 p-2 bg-gray-50/50 rounded-lg border">
        {history.length === 0 && <p className="text-sm text-gray-400 text-center p-4">No questions have been asked yet.</p>}
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isReplying && history[history.length-1]?.role === 'user' && (
           <div className="flex justify-start">
              <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {!disabled && (
        <div className="mt-2 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isReplying || disabled}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition disabled:bg-gray-100"
              aria-label="Ask a follow-up question"
            />
            <button
              type="submit"
              disabled={isReplying || !input.trim() || disabled}
              className="bg-pink-600 text-white font-bold p-2 rounded-md hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;