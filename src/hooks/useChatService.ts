import { useEffect, useRef } from 'react';
import { chatService as chatServiceInstance } from '@/lib/ai/chatService';

export function useChatService() {
  const chatServiceRef = useRef(chatServiceInstance);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      chatServiceRef.current.endChat().catch(console.warn);
    };
  }, []);

  return {
    chatService: chatServiceRef.current
  };
}
