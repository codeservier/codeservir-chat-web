# 🚀 CodeServir - Quick Setup Guide

## ✅ API Keys Configured!

Your API keys have been added to the `.env` file:
- ✅ OpenAI API Key
- ✅ Pinecone API Key

---

## 📋 Next Steps

### Step 1: Create Pinecone Index

**IMPORTANT:** You need to create a Pinecone index before the app will work.

1. Go to https://app.pinecone.io
2. Log in with your account
3. Click **"Create Index"**
4. Configure:
   - **Name:** `codeservir-embeddings`
   - **Dimensions:** `1536`
   - **Metric:** `cosine`
   - **Cloud Provider:** `AWS`
   - **Region:** `us-east-1` (or closest to you)
5. Click **Create Index**

**Wait 1-2 minutes for the index to be ready**

---

### Step 2: Setup PostgreSQL Database

```bash
# Check if PostgreSQL is installed
which psql

# If not installed (macOS):
brew install postgresql
brew services start postgresql

# Create database
createdb codeservir

# Load schema
psql -d codeservir -f server/database/schema.sql
```

---

### Step 3: Setup Redis

```bash
# Check if Redis is installed
which redis-cli

# If not installed (macOS):
brew install redis
brew services start redis

# Test Redis
redis-cli ping
# Should return: PONG
```

---

### Step 4: Install Dependencies (if not done)

```bash
npm install --legacy-peer-deps
```

---

### Step 5: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
npm run server
```

---

## 🧪 Testing

Once everything is running:

1. **Frontend:** http://localhost:3000
2. **Backend:** http://localhost:5000

### Create Your First Chatbot:

1. Open http://localhost:3000
2. Fill in the form:
   - Owner Name: Test User
   - Business Name: My Test Business
   - Website URL: https://example.com
   - Email: test@example.com
   - Description: A test business for demonstration
3. Click **"Generate Chatbot"**
4. Wait for processing (30-60 seconds)
5. Copy the embed code!

---

## ✅ Checklist

Before running the app:

- [x] OpenAI API Key added
- [x] Pinecone API Key added
- [ ] **Pinecone Index Created** (`codeservir-embeddings`)
- [ ] PostgreSQL installed and running
- [ ] Database `codeservir` created
- [ ] Schema loaded
- [ ] Redis installed and running
- [ ] Dependencies installed

---

## 🔧 Troubleshooting

### "Pinecone index not found"
- Make sure you created the index named exactly: `codeservir-embeddings`
- Check dimensions are `1536`
- Wait 1-2 minutes after creating

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
pg_isready

# Start it if not running
brew services start postgresql
```

### "Redis connection failed"
```bash
# Check if Redis is running
redis-cli ping

# Start it if not running
brew services start redis
```

### "OpenAI API Error"
- Check your API key is correct
- Verify you have credits: https://platform.openai.com/account/billing

---

## 🎯 What Happens When You Create a Chatbot

1. **Form Submission** → Validates input
2. **Chatbot Creation** → Generates unique ID
3. **Website Scraping** → Extracts content from your website
4. **AI Processing** → Creates embeddings with OpenAI
5. **Vector Storage** → Stores in Pinecone
6. **Database Save** → Saves configuration
7. **Success!** → Shows embed code

---

## 📱 Using the Chatbot

### On a Website:
```html
<script>
(function () {
  var s = document.createElement("script");
  s.src = "http://localhost:5000/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID");
  document.body.appendChild(s);
})();
</script>
```

### In Mobile App (WebView):
```
http://localhost:5000/embed/YOUR_CHATBOT_ID
```

---

## 💡 Tips

- **First Time:** Start with a simple website (like example.com)
- **Testing:** Use the free tier limits wisely
- **Development:** Keep PostgreSQL and Redis running
- **Production:** See DEPLOYMENT.md for production setup

---

## 🆘 Need Help?

1. Check the console for errors
2. Verify all services are running
3. Check API keys are correct
4. Make sure Pinecone index exists

---

**Ready to start? Create your Pinecone index and let's go! 🚀**

**Next:** Go to https://app.pinecone.io and create the index!
