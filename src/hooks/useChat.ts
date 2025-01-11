import { useState } from 'react';

export function useChat() {
  const [isProcessing] = useState(false);
  const [isStreaming] = useState(false);
  const [isRecording] = useState(false);
  const [volume] = useState(0);

  const processMessage = async (_message: string) => {
    return 'AI chat is currently disabled';
  };

  const streamQuestion = async (_question: string, onChunk: (chunk: string) => void) => {
    onChunk('AI chat is currently disabled. This feature will be available soon!');
  };

  const startRecording = () => {
    // Disabled
  };

  const stopRecording = () => {
    // Disabled
  };

  return {
    processMessage,
    isProcessing,
    isStreaming,
    isRecording,
    volume,
    startRecording,
    stopRecording,
    streamQuestion,
    error: null
  };
}