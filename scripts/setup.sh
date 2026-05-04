#!/bin/bash
# scripts/setup.sh — Full local development setup

set -e
echo "🚀 Setting up AR Menu development environment..."

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 20+"
  exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Please install Docker"
  exit 1
fi

echo "✅ Prerequisites found"

# Start infrastructure
echo "🐳 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis
echo "⏳ Waiting for services to be ready..."
sleep 5

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
cp -n .env.example .env 2>/dev/null || true
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
cd ..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
cp -n .env.example .env.local 2>/dev/null || true
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔧 To start development servers:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "📱 Login credentials:"
echo "  Email:    demo@armenu.com"
echo "  Password: Password123"
echo ""
echo "🌐 URLs:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:4000"
echo "  AR Viewer: http://localhost:3000/ar/demo-{id}"
