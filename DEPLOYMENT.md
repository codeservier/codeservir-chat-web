# Deployment Guide - codeservir

This guide covers deploying codeservir to production.

## 🌐 Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React - Vercel/Netlify)
│  (Port 3000)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │ (Node.js - Railway/Heroku)
│  (Port 5000)│
└──────┬──────┘
       │
       ├──────► PostgreSQL (Database)
       ├──────► Redis (Cache)
       ├──────► Pinecone (Vector DB)
       ├──────► OpenAI (AI)
       └──────► Razorpay (Payments)
```

## 📦 Prerequisites

1. **Accounts Needed:**
   - Vercel or Netlify (Frontend)
   - Railway, Heroku, or DigitalOcean (Backend)
   - Supabase or AWS RDS (PostgreSQL)
   - Redis Cloud or Upstash (Redis)
   - Pinecone (Vector Database)
   - OpenAI (API)
   - Razorpay or Stripe (Payments)

2. **Domain (Optional):**
   - Custom domain for production
   - SSL certificate (usually provided by hosting)

## 🚀 Step-by-Step Deployment

### 1. Database Setup (PostgreSQL)

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run the schema from `server/database/schema.sql`
5. Copy connection string from Settings → Database

#### Option B: AWS RDS

1. Create PostgreSQL instance
2. Configure security groups
3. Connect and run schema
4. Note connection details

### 2. Redis Setup

#### Option A: Upstash (Recommended)

1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection details

#### Option B: Redis Cloud

1. Go to [redis.com](https://redis.com)
2. Create free database
3. Copy connection string

### 3. Pinecone Setup

1. Go to [pinecone.io](https://pinecone.io)
2. Create account and project
3. Create index:
   - Name: `codeservir-embeddings`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Cloud: `AWS`
   - Region: `us-east-1`
4. Copy API key

### 4. OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add billing method
4. Copy API key

### 5. Payment Gateway Setup

#### Razorpay

1. Go to [razorpay.com](https://razorpay.com)
2. Create account
3. Get API keys from Dashboard
4. Enable required payment methods

#### Stripe (Alternative)

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get API keys
4. Configure webhook endpoint

### 6. Backend Deployment (Railway)

#### Setup Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize project:
```bash
cd codeservir
railway init
```

4. Set environment variables:
```bash
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set DB_HOST=your_db_host
railway variables set DB_PORT=5432
railway variables set DB_NAME=codeservir
railway variables set DB_USER=your_db_user
railway variables set DB_PASSWORD=your_db_password
railway variables set REDIS_HOST=your_redis_host
railway variables set REDIS_PORT=your_redis_port
railway variables set REDIS_PASSWORD=your_redis_password
railway variables set OPENAI_API_KEY=your_openai_key
railway variables set PINECONE_API_KEY=your_pinecone_key
railway variables set PINECONE_INDEX_NAME=codeservir-embeddings
railway variables set RAZORPAY_KEY_ID=your_razorpay_key
railway variables set RAZORPAY_KEY_SECRET=your_razorpay_secret
railway variables set FRONTEND_URL=https://your-frontend-domain.com
railway variables set CDN_URL=https://your-backend-domain.com
```

5. Create `Procfile`:
```
web: npm run server
```

6. Deploy:
```bash
railway up
```

7. Get deployment URL:
```bash
railway domain
```

#### Alternative: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create codeservir-api`
4. Set environment variables:
```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
# ... set all other variables
```
5. Deploy:
```bash
git push heroku main
```

### 7. Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Update API URL in `src/components/LandingPage.tsx`:
```typescript
const API_URL = 'https://your-backend-domain.com';
```

4. Deploy:
```bash
vercel --prod
```

5. Configure environment variables in Vercel dashboard:
   - `REACT_APP_API_URL=https://your-backend-domain.com`

#### Alternative: Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

Or use Netlify UI:
- Drag and drop the `build` folder
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `build`

### 8. CDN Setup for Widget

#### Option A: Use Backend Domain

The widget is already served from your backend at `/widget.js`

Update embed code to use production URL:
```html
<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://your-backend-domain.com/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID");
  document.body.appendChild(s);
})();
</script>
```

#### Option B: Cloudflare CDN

1. Upload `public/widget.js` to Cloudflare R2
2. Enable CDN
3. Update `CDN_URL` environment variable

### 9. Domain Configuration

#### Custom Domain for Backend

**Railway:**
```bash
railway domain add api.codeservir.com
```

**Heroku:**
```bash
heroku domains:add api.codeservir.com
```

Then add CNAME record in your DNS:
```
CNAME api.codeservir.com -> your-railway-domain.railway.app
```

#### Custom Domain for Frontend

**Vercel:**
1. Go to project settings
2. Add domain
3. Configure DNS as instructed

**Netlify:**
1. Go to Domain settings
2. Add custom domain
3. Update DNS records

### 10. SSL/HTTPS

Both Railway, Heroku, Vercel, and Netlify provide automatic SSL certificates.

Ensure all URLs use `https://` in production.

### 11. CORS Configuration

Update backend CORS settings in `server/src/server.ts`:

```typescript
app.use(cors({
  origin: [
    'https://codeservir.com',
    'https://www.codeservir.com',
    'https://your-frontend-domain.com'
  ],
  credentials: true,
}));
```

### 12. Environment Variables Checklist

**Backend (.env):**
```
✓ PORT
✓ NODE_ENV
✓ FRONTEND_URL
✓ DB_HOST
✓ DB_PORT
✓ DB_NAME
✓ DB_USER
✓ DB_PASSWORD
✓ REDIS_HOST
✓ REDIS_PORT
✓ REDIS_PASSWORD
✓ OPENAI_API_KEY
✓ OPENAI_MODEL
✓ PINECONE_API_KEY
✓ PINECONE_INDEX_NAME
✓ RAZORPAY_KEY_ID
✓ RAZORPAY_KEY_SECRET
✓ CDN_URL
✓ CORS_ORIGIN
```

## 🔍 Post-Deployment Checklist

- [ ] Test chatbot creation
- [ ] Verify website scraping works
- [ ] Test chat functionality
- [ ] Verify embed code works on test website
- [ ] Test mobile WebView integration
- [ ] Verify payment flow (test mode)
- [ ] Check usage tracking
- [ ] Test subscription limits
- [ ] Monitor error logs
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure backups for database
- [ ] Set up analytics (optional)

## 📊 Monitoring

### Application Monitoring

**Sentry (Recommended):**
```bash
npm install @sentry/node @sentry/react
```

Add to `server/src/server.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring

- Use Supabase dashboard
- Set up alerts for high usage
- Monitor query performance

### Redis Monitoring

- Use Upstash dashboard
- Monitor memory usage
- Set up alerts

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 💰 Cost Estimation

### Monthly Costs (Approximate)

| Service | Free Tier | Paid (Starting) |
|---------|-----------|-----------------|
| Railway/Heroku | $0-5 | $5-20 |
| Supabase | Free | $25+ |
| Upstash Redis | Free | $10+ |
| Pinecone | Free (1 index) | $70+ |
| OpenAI | Pay-per-use | $20-100+ |
| Vercel | Free | $20+ |
| Domain | - | $10-15/year |

**Total:** ~$0-15/month (free tiers) or $150-250/month (paid)

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Timeout**
- Check firewall rules
- Verify connection string
- Ensure database is running

**2. Redis Connection Failed**
- Verify Redis is accessible
- Check password
- Ensure correct port

**3. Pinecone Index Not Found**
- Create index with correct dimensions
- Verify API key
- Check index name

**4. CORS Errors**
- Update CORS_ORIGIN in backend
- Ensure frontend URL is whitelisted

**5. Widget Not Loading**
- Check CDN_URL is correct
- Verify widget.js is accessible
- Check browser console for errors

## 📈 Scaling

### Horizontal Scaling

- Use load balancer (Railway/Heroku auto-scale)
- Add more backend instances
- Use Redis cluster for caching

### Database Scaling

- Enable connection pooling
- Add read replicas
- Consider sharding for large scale

### Caching Strategy

- Cache chatbot configs
- Cache frequently accessed data
- Use CDN for static assets

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` file
   - Use secrets management
   - Rotate keys regularly

2. **Database:**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **API:**
   - Rate limiting
   - Input validation
   - SQL injection prevention

4. **Monitoring:**
   - Set up error tracking
   - Monitor unusual activity
   - Log all API requests

---

**Deployment Complete! 🎉**

Your codeservir platform is now live and ready to serve users worldwide!
