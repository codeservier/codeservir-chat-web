# Quick Start Guide - codeservir

Get your AI chatbot SaaS up and running in 10 minutes!

## ⚡ Prerequisites

Make sure you have these installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Redis 6+ ([Download](https://redis.io/download))

## 🚀 Quick Setup

### 1. Install Dependencies (2 min)

```bash
cd codeservir
npm install --legacy-peer-deps
```

### 2. Setup Environment (3 min)

Create `.env` file:

```bash
cp .env.example .env
```

**Minimum required configuration:**

```env
# Database (use your local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeservir
DB_USER=postgres
DB_PASSWORD=your_password

# Redis (local)
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI (get free trial key from platform.openai.com)
OPENAI_API_KEY=sk-your-key-here

# Pinecone (get free account from pinecone.io)
PINECONE_API_KEY=your-key-here
PINECONE_INDEX_NAME=codeservir-embeddings

# Razorpay (optional for testing, use test keys from razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
```

### 3. Setup Database (2 min)

```bash
# Create database
createdb codeservir

# Run schema
psql -d codeservir -f server/database/schema.sql
```

### 4. Start Services (1 min)

```bash
# Make sure PostgreSQL is running
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start from Services

# Make sure Redis is running
# macOS: brew services start redis
# Linux: sudo systemctl start redis
# Windows: Start from Services
```

### 5. Run the App (1 min)

```bash
# Start both frontend and backend
npm run dev
```

**That's it! 🎉**

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📝 Create Your First Chatbot

1. Open http://localhost:3000
2. Fill in the form:
   - Owner Name: Your Name
   - Business Name: Test Business
   - Website URL: https://example.com (or any website)
   - Contact Email: test@example.com
   - Business Description: A test business for demonstration
3. Click "Generate Chatbot"
4. Copy the embed code
5. Test it on a local HTML file!

## 🧪 Test the Chatbot

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chatbot Test</title>
</head>
<body>
    <h1>My Website</h1>
    
    <!-- Paste your embed code here -->
    <script>
    (function () {
      var s = document.createElement("script");
      s.src = "http://localhost:5000/widget.js";
      s.async = true;
      s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID");
      document.body.appendChild(s);
    })();
    </script>
</body>
</html>
```

Open this file in your browser and see the chatbot in action!

## 🔧 Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it:
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Redis connection failed"
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
# If not, start it:
# macOS: brew services start redis
# Linux: sudo systemctl start redis
```

### "OpenAI API error"
- Make sure your API key is correct
- Check you have credits in your OpenAI account
- Visit: https://platform.openai.com/account/billing

### "Pinecone error"
- Create an index at pinecone.io
- Name: `codeservir-embeddings`
- Dimensions: `1536`
- Metric: `cosine`

## 📚 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Check DEPLOYMENT.md** for production deployment
3. **Customize the UI** in `src/components/LandingPage.tsx`
4. **Add features** as needed

## 💡 Tips

- Use test mode for Razorpay during development
- Monitor your OpenAI usage to avoid unexpected costs
- Start with the free Pinecone tier (1 index)
- Use local PostgreSQL and Redis for development

## 🎯 What You Built

You now have a fully functional SaaS platform that:
- ✅ Creates AI chatbots instantly
- ✅ Scrapes websites automatically
- ✅ Uses RAG for intelligent responses
- ✅ Tracks usage and enforces limits
- ✅ Handles payments
- ✅ Works on any website
- ✅ Supports mobile apps

## 🚀 Ready for Production?

When you're ready to deploy:
1. Read `DEPLOYMENT.md`
2. Set up production databases
3. Configure domain and SSL
4. Deploy to Railway/Vercel
5. Go live!

---

**Need Help?**
- Check the README.md for detailed docs
- Review the code comments
- Open an issue on GitHub

**Happy Building! 🎉**
