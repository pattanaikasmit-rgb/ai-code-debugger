#!/bin/bash

echo "🚀 AI Code Debugger - Quick Deployment Script"
echo "=========================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Windows: https://git-scm.com/download/win"
    echo "   After installation, restart your terminal and run this script again."
    exit 1
fi

echo "✅ Git found"

# Navigate to project directory
cd "c:\Users\DELL\OneDrive\Desktop\Project report\AI-Code-Debugger"

# Check if we're in the right directory
if [ ! -f "server/server.js" ] || [ ! -f "client/package.json" ]; then
    echo "❌ Not in the correct project directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"

# Add all changes
echo "📝 Adding all changes to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Ready for deployment - Fix render config and build issues"

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo "🔗 Remote 'origin' exists"
else
    echo "🔗 Adding remote origin..."
    echo "⚠️  Please replace 'yourusername' with your actual GitHub username in the next step"
    git remote add origin https://github.com/yourusername/ai-code-debugger.git
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to https://render.com and deploy backend"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "2. Go to https://netlify.com and deploy frontend"
echo "   - Base Directory: client"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist"
echo ""
echo "📋 Don't forget to:"
echo "   - Set OPENROUTER_API_KEY in Render"
echo "   - Set VITE_API_URL in Netlify"
echo ""
echo "🎯 Your URLs will be:"
echo "   Backend: https://ai-code-debugger-api.onrender.com"
echo "   Frontend: https://ai-code-debugger.netlify.app"
