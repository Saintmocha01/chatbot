/*
  # SAINT Cryptocurrency Advisor - Database Schema

  ## Overview
  This migration creates the foundational database structure for SAINT, a rule-based cryptocurrency advisor chatbot.

  ## New Tables
  
  ### 1. `chat_sessions`
  Stores individual chat sessions for users
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid, nullable) - Links to authenticated user (nullable for anonymous users)
  - `started_at` (timestamptz) - When the session began
  - `last_activity_at` (timestamptz) - Last interaction timestamp
  - `session_data` (jsonb) - Stores session context and preferences
  
  ### 2. `chat_messages`
  Stores all chat messages between users and SAINT
  - `id` (uuid, primary key) - Unique message identifier
  - `session_id` (uuid, foreign key) - Links to chat session
  - `role` (text) - Either 'user' or 'assistant'
  - `content` (text) - The message content
  - `metadata` (jsonb) - Additional data like crypto analyzed, sentiment, etc.
  - `created_at` (timestamptz) - Message timestamp
  
  ### 3. `crypto_cache`
  Caches cryptocurrency data to reduce API calls
  - `id` (uuid, primary key) - Unique cache entry identifier
  - `crypto_symbol` (text) - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
  - `data` (jsonb) - Cached API response data
  - `cached_at` (timestamptz) - When data was cached
  - `expires_at` (timestamptz) - When cache expires (5 minutes default)

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:
  
  #### chat_sessions
  - Authenticated users can view and manage their own sessions
  - Anonymous users can create sessions
  
  #### chat_messages
  - Users can view messages from their own sessions
  - Users can create messages in their own sessions
  
  #### crypto_cache
  - Public read access for all users (cached market data)
  - Only service role can write (managed by Edge Function)

  ## Indexes
  - `chat_messages.session_id` - Fast message retrieval by session
  - `crypto_cache.crypto_symbol` - Fast lookup of cached crypto data
  - `crypto_cache.expires_at` - Efficient cache expiration queries

  ## Important Notes
  1. Cache expiration is set to 5 minutes to balance freshness with API rate limits
  2. Session data is stored as JSONB for flexibility in storing user preferences
  3. Message metadata can store analysis results for historical reference
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  session_data jsonb DEFAULT '{}'::jsonb
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create crypto_cache table
CREATE TABLE IF NOT EXISTS crypto_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_symbol text NOT NULL UNIQUE,
  data jsonb NOT NULL,
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '5 minutes')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_crypto_cache_symbol ON crypto_cache(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_cache_expires ON crypto_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view own sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create sessions"
  ON chat_sessions FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous users can view own sessions"
  ON chat_sessions FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from own sessions"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can view messages from own sessions"
  ON chat_messages FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id IS NULL
    )
  );

CREATE POLICY "Anonymous users can create messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for crypto_cache (public read, service write)
CREATE POLICY "Anyone can view cached crypto data"
  ON crypto_cache FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Service role can manage cache"
  ON crypto_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);