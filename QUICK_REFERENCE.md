# 🎯 CodeServir - Quick Reference

## ✅ Current Status

### API Keys Configured
- ✅ **OpenAI API Key:** Configured in `.env`
- ✅ **Pinecone API Key:** Configured in `.env`

### Setup Running
- 🔄 Installing PostgreSQL
- 🔄 Installing Redis
- 🔄 Creating database
- 🔄 Loading schema
- 🔄 Installing dependencies

---

## 🚨 CRITICAL: Create Pinecone Index

**Before the app will work, you MUST create a Pinecone index:**

1. **Go to:** https://app.pinecone.io
2. **Log in** with your Pinecone account
3. **Click:** "Create Index"
4. **Configure:**
   ```
   Name: codeservir-embeddings
   Dimensions: 1536
   Metric: cosine
   Cloud: AWS
   Region: us-east-1 (or closest)
   ```
5. **Click:** "Create Index"
6. **Wait:** 1-2 minutes for index to be ready

---

## 🚀 Starting the App

Once setup is complete:

```bash
# Start both frontend and backend
npm run dev
```

Or separately:

```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend  
npm run server
```

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Widget:** http://localhost:5000/widget.js

---

## 🧪 Test Your First Chatbot

1. Open http://localhost:3000
2. Fill the form:
   - **Owner Name:** Your Name
   - **Business Name:** Test Company
   - **Website:** https://example.com
   - **Email:** test@example.com
   - **Description:** A test business
3. Click **"Generate Chatbot"**
4. Wait 30-60 seconds
5. Copy the embed code!

---

## 📊 What's Installed

- ✅ React Frontend (with Tailwind CSS)
- ✅ Node.js Backend (Express + TypeScript)
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ OpenAI Integration
- ✅ Pinecone Vector DB
- ✅ Web Scraping (Puppeteer)
- ✅ Payment System (Razorpay ready)

---

## 🔧 Common Commands

```bash
# Start development
npm run dev

# Start frontend only
npm start

# Start backend only
npm run server

# Install dependencies
npm install --legacy-peer-deps

# Check PostgreSQL
pg_isready

# Check Redis
redis-cli ping

# Create database
createdb codeservir

# Load schema
psql -d codeservir -f server/database/schema.sql
```

---

## 🐛 Troubleshooting

### "Pinecone index not found"
→ Create the index at https://app.pinecone.io

### "Cannot connect to database"
→ Run: `brew services start postgresql@14`

### "Redis connection failed"
→ Run: `brew services start redis`

### "OpenAI API error"
→ Check credits at https://platform.openai.com/account/billing

---

## 📱 Embed Code Example

```html
<script>
(function () {
  var s = document.createElement("script");
  s.src = "http://localhost:5000/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "cb_xxxxx");
  document.body.appendChild(s);
})();
</script>
```

---

## 💰 Pricing Plans

| Plan | Price | Chats |
|------|-------|-------|
| Free | ₹0 | 1,000 |
| Basic | ₹999 | 100,000 |
| Pro | ₹1,999 | 1,000,000 |
| Premium | ₹5,999 | 100,000,000 |

---

## 📖 Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `README.md` - Project overview
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Production deployment

---

## ⚡ Quick Checklist

Before starting the app:

- [x] OpenAI API Key added
- [x] Pinecone API Key added
- [ ] **Pinecone Index created** ← DO THIS NOW!
- [ ] PostgreSQL running
- [ ] Redis running
- [ ] Database created
- [ ] Schema loaded
- [ ] Dependencies installed

---

**🎯 Next Step: Create your Pinecone index at https://app.pinecone.io**

**Then run:** `npm run dev`
