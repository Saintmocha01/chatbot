import { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from './types/chat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { sendMessage, createChatSession } from './services/chatService';
import { TrendingUp, Loader2 } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const id = await createChatSession();
        setSessionId(id);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };
    initSession();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(content, sessionId || undefined);

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <TrendingUp size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">SAINT</h1>
            <p className="text-xs text-slate-500">Crypto Advisor</p>
          </div>
        </div>
      </header>

      {messages.length === 0 ? (
        <WelcomeScreen onStartChat={handleSendMessage} />
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 p-4 bg-slate-50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1 text-slate-900">
                    SAINT
                  </div>
                  <div className="text-slate-500 italic">
                    Analyzing cryptocurrency data...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
      )}

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
