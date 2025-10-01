import { supabase } from '../lib/supabase';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/saint-advisor`;

export interface ChatResponse {
  response: string;
  sessionId?: string;
}

export async function sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
}

export async function createChatSession(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: null,
        session_data: {},
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }
}
