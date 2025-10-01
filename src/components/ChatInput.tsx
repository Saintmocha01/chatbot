import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SAINT about any cryptocurrency..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
          style={{
            minHeight: '48px',
            maxHeight: '120px',
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg px-5 py-3 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
        >
          <Send size={18} />
          Send
        </button>
      </div>
    </form>
  );
}
