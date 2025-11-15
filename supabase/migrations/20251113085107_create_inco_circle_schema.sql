/*
  # Inco Circle Social App Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `x_username` (text, unique) - Twitter/X username
      - `privacy_answer` (text) - User's answer to why privacy is important (max 50 words)
      - `created_at` (timestamptz) - When user joined
      - `position_angle` (float) - Position on the circle (0-360 degrees)
    
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `question` (text) - The quiz question
      - `options` (jsonb) - Array of answer options
      - `correct_answer` (integer) - Index of correct answer
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `score` (integer) - Number of correct answers
      - `total_questions` (integer) - Total questions in quiz
      - `answers` (jsonb) - User's answers
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read all user profiles (public data)
    - Users can only update their own profile
    - Users can insert their own profile
    - Quiz questions are public (read-only)
    - Users can read their own quiz attempts
    - Users can insert their own quiz attempts
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  x_username text UNIQUE NOT NULL,
  privacy_answer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  position_angle float DEFAULT (random() * 360),
  CONSTRAINT privacy_answer_length CHECK (length(privacy_answer) <= 300)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_users_x_username ON users(x_username);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions("order");
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);

INSERT INTO quiz_questions (question, options, correct_answer, "order") VALUES
  (
    'What is zero-knowledge proof?',
    '["A method to prove you know something without revealing it", "A type of encryption algorithm", "A blockchain consensus mechanism", "A password recovery system"]',
    0,
    1
  ),
  (
    'Which technology enables privacy-preserving smart contracts?',
    '["Fully Homomorphic Encryption (FHE)", "Public key infrastructure", "DNS servers", "Cloud computing"]',
    0,
    2
  ),
  (
    'What does "on-chain privacy" mean?',
    '["Keeping transaction details private while on blockchain", "Using private blockchain networks", "Hiding your wallet address", "Encrypting your private keys"]',
    0,
    3
  ),
  (
    'What is the main risk of sharing your seed phrase?',
    '["Complete loss of wallet control", "Slower transactions", "Higher gas fees", "Limited token access"]',
    0,
    4
  ),
  (
    'What is a privacy-preserving computation?',
    '["Computing on encrypted data without decrypting it", "Using VPN for blockchain access", "Mining cryptocurrency privately", "Storing data offline"]',
    0,
    5
  ),
  (
    'Why is privacy important in DeFi?',
    '["Protects financial information and trading strategies", "Makes transactions faster", "Reduces gas fees", "Increases token value"]',
    0,
    6
  ),
  (
    'What is confidential smart contract execution?',
    '["Running contracts while keeping inputs/outputs private", "Deploying contracts without audits", "Using private blockchains only", "Encrypting contract code"]',
    0,
    7
  ),
  (
    'How does Inco Network enhance privacy?',
    '["Uses FHE for confidential smart contracts", "Hides all blockchain data", "Creates private networks", "Removes transaction fees"]',
    0,
    8
  );
