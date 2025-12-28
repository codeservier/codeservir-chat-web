-- CodeServir Database Schema

-- Chatbots Table
CREATE TABLE IF NOT EXISTS chatbots (
    id VARCHAR(255) PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    website_url TEXT NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    business_description TEXT NOT NULL,
    primary_color VARCHAR(7) DEFAULT '#4F46E5',
    secondary_color VARCHAR(7) DEFAULT '#10B981',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    embed_domains TEXT[], -- Array of allowed domains
    CONSTRAINT valid_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Chat Usage Table
CREATE TABLE IF NOT EXISTS chat_usage (
    id SERIAL PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
    chat_count BIGINT DEFAULT 0,
    last_chat_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chatbot_id)
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'basic', 'pro', 'premium')),
    chat_limit BIGINT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'scraped', 'description', 'contact'
    source_url TEXT,
    vector_id VARCHAR(255), -- Reference to Pinecone vector ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
    payment_gateway VARCHAR(50) NOT NULL, -- 'razorpay' or 'stripe'
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_chatbots_id ON chatbots(id);
CREATE INDEX idx_chat_usage_chatbot ON chat_usage(chatbot_id);
CREATE INDEX idx_subscriptions_chatbot ON subscriptions(chatbot_id);
CREATE INDEX idx_knowledge_chatbot ON knowledge_base(chatbot_id);
CREATE INDEX idx_transactions_chatbot ON payment_transactions(chatbot_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_chatbots_updated_at BEFORE UPDATE ON chatbots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_usage_updated_at BEFORE UPDATE ON chat_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_chatbot_session ON chat_history(chatbot_id, session_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
