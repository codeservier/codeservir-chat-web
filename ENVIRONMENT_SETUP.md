# 🌍 Full Environment Setup Guide

Use this guide to configure your project for **Local Development** vs **Online Deployment (Vercel)**.

## 💻 Local Development (Your Computer)

### Frontend (`frontend/.env`)
This file is already configured on your machine.
```ini
PORT=3000
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_WIDGET_URL=http://localhost:5001
```

### Backend (`backend/.env`)
This file uses local services.
```ini
PORT=5001
# Database (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=dineshkumar
DB_NAME=codeservir
# Redis (Local)
REDIS_HOST=localhost
REDIS_PORT=6379
# API
CDN_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
# Secrets (Keep these!)
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
```

---

## ☁️ Online Deployment (Vercel)

You must manually add these in **Vercel Project Settings > Environment Variables**.

### 1. Backend Project (`codeservir-backend`)
| Variable Key | Value Example | Source |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://neondb_owner:password@...neon.tech/neondb?sslmode=require` | **Neon.tech** |
| `REDIS_URL` | `rediss://default:password@...upstash.io:6379` | **Upstash** |
| `CDN_URL` | `https://your-backend-project.vercel.app` | Vercel Backend Domain |
| `CORS_ORIGIN` | `https://your-frontend-project.vercel.app` | Vercel Frontend Domain |
| `OPENAI_API_KEY` | `sk-...` | OpenAI |
| `PINECONE_API_KEY` | `...` | Pinecone |

> **Note:** When `DATABASE_URL` and `REDIS_URL` are present, the app automatically ignores `DB_HOST`/`REDIS_HOST` logic and uses the cloud strings.

### 2. Frontend Project (`codeservir-frontend`)
| Variable Key | Value Example |
| :--- | :--- |
| `REACT_APP_API_URL` | `https://your-backend-project.vercel.app/api` |
| `REACT_APP_WIDGET_URL` | `https://your-backend-project.vercel.app` |

---

## 🔄 Workflow
- **Run Locally:** Just run `npm run dev` in backend and `npm start` in frontend. They use the `.env` files.
- **Run Online:** Push to GitHub. Vercel uses the Dashboard Environment Variables.
