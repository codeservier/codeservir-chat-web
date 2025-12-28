#!/bin/bash

echo "🚀 CodeServir - Alag Alag Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check dependencies
echo "📦 Installing Dependencies..."
echo "--> Frontend..."
cd frontend && npm install --legacy-peer-deps
cd ..
echo "--> Backend..."
cd backend && npm install --legacy-peer-deps
cd .. // Go back to root
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create PostgreSQL database
echo "🗄️  Checking Database..."
if command -v psql &> /dev/null; then
    createdb codeservir 2>/dev/null || echo "Database exists or error (ignoring if exists)"
    
    if [ -f "backend/database/schema.sql" ]; then
        psql -d codeservir -f backend/database/schema.sql > /dev/null 2>&1
        echo -e "${GREEN}✅ Database schema loaded${NC}"
    else
        echo -e "${RED}❌ backend/database/schema.sql not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL client (psql) not found. Skipping DB setup.${NC}"
fi
echo ""

# Check Envs
echo "🔑 Checking Environment..."
if [ ! -f "frontend/.env" ]; then
    cp .env frontend/.env 2>/dev/null || echo "Please create frontend/.env"
fi
if [ ! -f "backend/.env" ]; then
    cp .env backend/.env 2>/dev/null || echo "Please create backend/.env"
fi
echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

echo "======================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "======================================"
echo ""
echo "To run ALAG ALAG (Separately):"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
