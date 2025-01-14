import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { useChatStore } from '@/lib/chat/chatStore';
import { chatService } from '@/lib/ai/chatService';
import { ChatMessage } from './ChatMessage';
import { Button } from '../ui/Button';
import type { ChatMessage as IChatMessage } from '@/lib/chat/types';

export function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, error } = useChatStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      const initializeChat = async () => {
        setIsTyping(true);
        try {
          const initialMessages = await chatService.initializeChat();
          initialMessages
            .filter(msg => msg.role === 'assistant')
            .forEach(msg => {
              const chatMessage: IChatMessage = {
                id: Date.now().toString(),
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp || Date.now()
              };
              addMessage(chatMessage);
            });
          setIsInitialized(true);
          setIsTyping(false);
        } catch (error) {
          console.error('Chat initialization failed:', error);
          addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: error instanceof Error ? error.message : 'Chat service is currently unavailable',
            timestamp: Date.now()
          });
          setIsTyping(false);
        }
      };
      initializeChat();
    }
  }, [isOpen, isInitialized, addMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: Date.now()
    };

    addMessage(userMessage);

    try {
      if (!isInitialized) {
        await chatService.initializeChat();
        setIsInitialized(true);
      }

      const response = await chatService.sendMessage(currentMessage);
      
      if (!response) {
        throw new Error('No response received from chat service');
      }

      try {
        const parsedResponse = JSON.parse(response);
        const assistantMessage: IChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: typeof parsedResponse === 'object' 
            ? JSON.stringify(parsedResponse, null, 2)
            : parsedResponse,
          timestamp: Date.now()
        };
        addMessage(assistantMessage);
      } catch (error) {
        console.error('Failed to parse response:', error);
        throw new Error('Failed to process response from chat service');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';

      console.error('Chat error:', {
        error,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}`,
        timestamp: Date.now()
      });
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [
    "What documents do I need for a student visa?",
    "How much are the visa fees?",
    "What are the English requirements?",
    "Tell me about studying in Australia"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="bg-[hsl(var(--gold))] text-[hsl(var(--navy))] p-4 rounded-full shadow-lg hover:bg-[hsl(var(--gold))]/90 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">AI Immigration Assistant</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isTyping && (
                <div className="space-y-4">
                  <p className="text-white/60">Try asking:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMessage(question);
                        handleSubmit(new Event('submit') as any);
                      }}
                      className="block w-full p-3 text-left text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex space-x-2 p-4 bg-white/10 rounded-lg">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-150" />
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-500/20 text-red-200 rounded-lg">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20"
                />
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-[hsl(var(--gold))] text-[hsl(var(--navy))] px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
