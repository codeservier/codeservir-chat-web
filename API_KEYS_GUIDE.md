# 🔑 CodeServir - API Keys Setup Guide

This guide will help you obtain all the necessary API keys to run CodeServir.

---

## Required API Keys

### 1. ✅ OpenAI API Key (REQUIRED)

**Purpose:** Powers the AI chatbot responses

**Steps to Get:**
1. Go to https://platform.openai.com
2. Click "Sign up" or "Log in"
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-proj-...` or `sk-...`)
6. **Important:** Save it immediately - you can't see it again!

**Add to .env:**
```env
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

**Cost:** Pay-as-you-go (starts at $0.01 per 1K tokens)
**Free Trial:** $5 credit for new accounts

---

### 2. ✅ Pinecone API Key (REQUIRED)

**Purpose:** Vector database for storing chatbot knowledge

**Steps to Get:**
1. Go to https://www.pinecone.io
2. Click **"Sign Up"** (free tier available)
3. Create a new project
4. Go to **API Keys** in the dashboard
5. Copy your API key

**Create Index:**
1. In Pinecone dashboard, click **"Create Index"**
2. Settings:
   - **Name:** `codeservir-embeddings`
   - **Dimensions:** `1536`
   - **Metric:** `cosine`
   - **Cloud:** `AWS`
   - **Region:** `us-east-1`
3. Click **Create**

**Add to .env:**
```env
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=codeservir-embeddings
```

**Cost:** Free tier (1 index, 100K vectors)

---

### 3. ✅ PostgreSQL Database (REQUIRED)

**Purpose:** Main database for storing chatbots, users, and data

#### Option A: Local PostgreSQL (Recommended for Development)

**Install:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Setup:**
```bash
# Create database
createdb codeservir

# Run schema
psql -d codeservir -f server/database/schema.sql
```

**Add to .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeservir
DB_USER=postgres
DB_PASSWORD=your_password
```

#### Option B: Supabase (Cloud - Free Tier)

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Create a new project
4. Go to **Settings → Database**
5. Copy connection details

**Add to .env:**
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
```

**Run Schema:**
- Go to **SQL Editor** in Supabase
- Paste contents of `server/database/schema.sql`
- Click **Run**

---

### 4. ✅ Redis (REQUIRED)

**Purpose:** Caching for high performance

#### Option A: Local Redis (Recommended for Development)

**Install:**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://redis.io/download
```

**Add to .env:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Option B: Upstash (Cloud - Free Tier)

1. Go to https://upstash.com
2. Sign up for free
3. Click **"Create Database"**
4. Choose **Redis**
5. Select region closest to you
6. Copy connection details

**Add to .env:**
```env
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

---

### 5. ⚠️ Razorpay API Keys (OPTIONAL - For Payments)

**Purpose:** Payment processing for subscriptions

**Steps to Get:**
1. Go to https://razorpay.com
2. Sign up for an account
3. Complete KYC (for production)
4. Go to **Settings → API Keys**
5. Generate **Test Keys** for development

**Add to .env:**
```env
# Test Keys (for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key

# Live Keys (for production - after KYC)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=your_live_secret_key
```

**Note:** You can skip this for initial testing. The app will work without payments.

---

## Complete .env File Template

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeservir
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-proj-your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Pinecone Configuration (REQUIRED)
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_INDEX_NAME=codeservir-embeddings

# Payment Gateway Configuration (OPTIONAL)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CDN Configuration
CDN_URL=http://localhost:5000

# Security
CORS_ORIGIN=http://localhost:3000
```

---

## Quick Setup Checklist

- [ ] **OpenAI API Key** - Get from platform.openai.com
- [ ] **Pinecone API Key** - Get from pinecone.io
- [ ] **Pinecone Index Created** - Name: `codeservir-embeddings`, Dimensions: 1536
- [ ] **PostgreSQL Installed** - Local or Supabase
- [ ] **Database Created** - Named `codeservir`
- [ ] **Schema Loaded** - Run `schema.sql`
- [ ] **Redis Installed** - Local or Upstash
- [ ] **Redis Running** - Test with `redis-cli ping`
- [ ] **.env File Created** - Copy from `.env.example`
- [ ] **All Keys Added** - Fill in your actual keys

---

## Testing Your Setup

### 1. Test PostgreSQL Connection
```bash
psql -d codeservir -U postgres -c "SELECT version();"
```

### 2. Test Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### 3. Test OpenAI API
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

### 4. Test Pinecone
- Log into Pinecone dashboard
- Verify index `codeservir-embeddings` exists
- Check it has 1536 dimensions

---

## Cost Breakdown

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| **OpenAI** | $5 credit | $10-50 (pay-as-you-go) |
| **Pinecone** | 1 index free | $0 (free tier sufficient) |
| **PostgreSQL** | Local: Free | $0 (local) or $25 (Supabase Pro) |
| **Redis** | Local: Free | $0 (local) or $10 (Upstash) |
| **Razorpay** | Free | 2% per transaction |
| **Total** | ~$5 | $10-85/month |

**Note:** You can run everything locally for FREE during development!

---

## Troubleshooting

### OpenAI API Error
- **Error:** "Invalid API key"
- **Solution:** Check key starts with `sk-` and is copied correctly
- **Check:** Visit https://platform.openai.com/account/api-keys

### Pinecone Connection Failed
- **Error:** "Index not found"
- **Solution:** Create index with exact name `codeservir-embeddings`
- **Check:** Dimensions must be 1536

### PostgreSQL Connection Refused
- **Error:** "Connection refused"
- **Solution:** Make sure PostgreSQL is running
- **Check:** `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)

### Redis Connection Failed
- **Error:** "ECONNREFUSED"
- **Solution:** Start Redis service
- **Check:** `redis-cli ping` should return PONG

---

## Next Steps

Once you have all API keys:

1. **Copy `.env.example` to `.env`**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys**
   - Edit `.env` with your actual keys

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Setup database**
   ```bash
   createdb codeservir
   psql -d codeservir -f server/database/schema.sql
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Visit http://localhost:3000**

---

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use test keys** for development
3. **Rotate keys** regularly
4. **Use environment variables** in production
5. **Enable 2FA** on all accounts

---

## Support

If you need help getting API keys:
- OpenAI: https://help.openai.com
- Pinecone: https://docs.pinecone.io
- Supabase: https://supabase.com/docs
- Upstash: https://docs.upstash.com

---

**Ready to start? Get your first API key (OpenAI) and let's go! 🚀**
