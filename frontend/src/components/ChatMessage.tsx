import { Bot, User } from 'lucide-react';
import clsx from 'clsx';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={clsx(
        'flex items-start space-x-3 message-fade-in',
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.sender === 'bot' && (
        <div className="flex-shrink-0 p-2 bg-blue-600 dark:bg-blue-500 rounded-full">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[80%] p-4 rounded-2xl',
          message.sender === 'user'
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
       <p className="text-xs opacity-70 mt-2">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
       </p>

      </div>
      {message.sender === 'user' && (
        <div className="flex-shrink-0 p-2 bg-gray-600 dark:bg-gray-500 rounded-full">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
} 