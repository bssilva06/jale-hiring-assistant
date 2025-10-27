import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../../services/api';
import Button from '../shared/Button';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';

const ChatBot = ({ jobId, applicationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Hi! I\'m here to answer your questions about this job. Feel free to ask in English or Spanish!',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    // Don't send if no jobId
    if (!jobId) {
      console.error('ChatBot: No jobId provided');
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: inputMessage,
        job_id: jobId,
        application_id: applicationId,
      });

      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const errorMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again later or contact our team directly.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    { en: "What's the pay?", es: "¿Cuánto paga?" },
    { en: "What's the schedule?", es: "¿Cuál es el horario?" },
    { en: "Where is it located?", es: "¿Dónde está ubicado?" },
    { en: "What are the requirements?", es: "¿Cuáles son los requisitos?" },
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question.en);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl z-50 flex flex-col" style={{ height: '600px', maxHeight: 'calc(100vh - 3rem)' }}>
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold">Jale AI Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-600 rounded p-1 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-primary' : 'bg-secondary'
                  }`}>
                    {message.sender === 'user' ? (
                      <UserIcon size={18} className="text-white" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-xs bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-300 transition-colors"
                  >
                    {q.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !inputMessage.trim()}
                className="px-4"
              >
                <Send size={20} />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
