import { createContext, useContext, useState, useCallback } from 'react';
import { chatService } from '@/lib/ai/chatService';
import { OpenAIError } from '@/lib/ai/utils/errorHandler';

interface ChatContextType {
  isOpen: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  isStreaming: boolean;
  error: string | null;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  streamQuestion: (question: string, onChunk: (chunk: string) => void) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!isInitialized) {
      initializeChat().catch(error => {
        const message = error instanceof Error ? error.message : 'Failed to initialize chat';
        setError(message);
      });
    }
  }, [isInitialized]);

  const initializeChat = async () => {
    setIsLoading(true);
    setError(null);
    let retries = 0;
    const maxRetries = 3;

    try {
      while (retries < maxRetries) {
        try {
          await chatService.initializeChat();
          break;
        } catch (error) {
          retries++;
          if (retries === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        }
      }

      setMessages([{
        role: 'assistant',
        content: 'Hi! I\'m your AI Immigration Assistant. How can I help you with your Australian student visa journey?'
      }]);
      setIsInitialized(true);
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to initialize chat. Please check your connection and try again.';
      setError(message);
      setMessages([{
        role: 'assistant',
        content: `Sorry, I'm currently unavailable. Please try again in a few moments or contact support if the issue persists.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsInitialized(false);
    setMessages([]);
    setError(null);
    chatService.endChat().catch(console.warn);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isInitialized) {
        await initializeChat();
      }
      const response = await chatService.sendMessage(message);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${errorMessage}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const streamQuestion = useCallback(async (
    question: string,
    onChunk: (chunk: string) => void
  ) => {
    setIsStreaming(true);
    try {
      const response = await chatService.sendMessage(question);
      onChunk(response);
    } catch (error) {
      const message = error instanceof OpenAIError ? error.message : 'Failed to process message';
      throw new Error(message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return (
    <ChatContext.Provider value={{
      isOpen,
      isLoading,
      isProcessing,
      isStreaming,
      messages,
      error,
      openChat,
      closeChat,
      sendMessage,
      streamQuestion
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}