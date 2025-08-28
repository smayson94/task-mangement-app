#!/bin/bash

echo "🚀 Preparing Task Management App for Railway Deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Check if backend dependencies are installed
echo "🔧 Checking backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
cd ..

echo "✅ Build complete! Ready for Railway deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push this code to GitHub"
echo "2. Connect your repo to Railway"
echo "3. Set environment variables in Railway dashboard"
echo "4. Deploy your backend to Railway"
echo "5. Deploy your frontend to Netlify (recommended) or Railway"
echo ""
echo "🔗 Railway Dashboard: https://railway.app"
echo "🔗 Netlify: https://netlify.com"
