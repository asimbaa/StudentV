import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ChatMessage as ChatMessageType } from '@/lib/chat/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg ${
        message.role === 'user'
          ? 'bg-[hsl(var(--gold))]/10 ml-auto max-w-[80%]'
          : 'bg-white/10 mr-auto max-w-[80%]'
      }`}
    >
      <ReactMarkdown
        className="prose prose-invert max-w-none"
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
              >
                {String(children)}
              </SyntaxHighlighter>
            ) : (
              <code className={className}>{children}</code>
            );
          }
        }}
      >
        {message.content}
      </ReactMarkdown>
      <div className="text-xs text-white/40 mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </motion.div>
  );
}