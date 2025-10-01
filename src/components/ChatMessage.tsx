import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-4 p-4 ${
        isAssistant ? 'bg-slate-50' : 'bg-white'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAssistant
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
            : 'bg-slate-200 text-slate-700'
        }`}
      >
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1 text-slate-900">
          {isAssistant ? 'SAINT' : 'You'}
        </div>
        <div className="text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
        <div className="text-xs text-slate-400 mt-2">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
