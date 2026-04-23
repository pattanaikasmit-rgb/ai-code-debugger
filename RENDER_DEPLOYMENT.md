# Render Deployment Guide

## Backend Configuration Status ✅

Your backend is already properly configured for Render deployment:

- **Start Script**: `node server.js` (already set in package.json)
- **Dynamic PORT**: Uses `process.env.PORT || 5000` (Render provides port automatically)
- **Dependencies**: All required packages are installed
- **Environment Variables**: Template created in `.env.production`

## Step-by-Step Render Deployment

### Step 1: Push Code to GitHub

1. **Initialize Git Repository** (if not already done)
   ```bash
   cd AI-Code-Debugger
   git init
   git add .
   git commit -m "Initial commit - AI Code Debugger"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name: `ai-code-debugger`
   - Description: `AI-powered code debugging application`
   - Make it Public (for free Render deployment)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/ai-code-debugger.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. **Sign Up for Render**
   - Go to [Render.com](https://render.com)
   - Sign up with your GitHub account
   - Verify your email

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository**
   - Click "Connect a repository"
   - Find and select `ai-code-debugger`
   - Click "Connect"

4. **Configure Service**
   ```
   Name: ai-code-debugger-api
   Environment: Node
   Region: Choose nearest region
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Set Environment Variables**
   Click "Environment" tab and add:
   ```
   NODE_ENV = production
   PORT = 10000
   OPENROUTER_API_KEY = your_openrouter_api_key_here
   ```

6. **Advanced Settings** (Optional)
   - Health Check Path: `/`
   - Auto-Deploy: Enabled (for automatic updates)

7. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

### Step 3: Verify Deployment

1. **Check Deployment Status**
   - Go to your Render dashboard
   - Wait for "Live" status

2. **Test the API**
   ```bash
   # Test health endpoint
   curl https://your-app-name.onrender.com/

   # Test debug endpoint
   curl -X POST https://your-app-name.onrender.com/debug \
   -H "Content-Type: application/json" \
   -d '{"code":"console.log(\"hello\")","language":"javascript"}'
   ```

3. **Get Your Render URL**
   - Your URL will be: `https://ai-code-debugger-api.onrender.com`
   - Copy this URL for frontend configuration

## Environment Variables Setup

### Required Environment Variables

1. **NODE_ENV**
   - Value: `production`
   - Purpose: Enable production mode

2. **PORT**
   - Value: `10000`
   - Purpose: Render's default port

3. **OPENROUTER_API_KEY**
   - Value: Your actual OpenRouter API key
   - Purpose: AI service integration

### How to Get OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up/login
3. Go to Dashboard → API Keys
4. Create new key
5. Copy the key (starts with `sk-or-v1-`)

## Troubleshooting

### Common Issues and Solutions

1. **Build Failed**
   - Check package.json for correct scripts
   - Verify all dependencies are in package.json
   - Check deployment logs for specific errors

2. **Application Not Starting**
   - Verify start command: `npm start`
   - Check server.js uses `process.env.PORT`
   - Ensure all environment variables are set

3. **CORS Errors**
   - Verify frontend URL is in CORS whitelist
   - Check environment variables are correct
   - Ensure backend is running before testing frontend

4. **OpenRouter API Errors**
   - Verify API key is correct and active
   - Check OpenRouter account credits
   - Ensure API key has proper permissions

### Deployment Logs

- Go to Render dashboard → your service → "Logs"
- Check for error messages
- Common error locations:
  - Build step (npm install failures)
  - Start step (server startup issues)
  - Runtime (API call errors)

## Post-Deployment Checklist

- [ ] Backend is live and responding
- [ ] Health check endpoint works
- [ ] Debug API endpoint works
- [ ] OpenRouter API integration works
- [ ] CORS properly configured
- [ ] Environment variables set correctly
- [ ] Auto-deploy enabled (optional)

## Next Steps

1. **Deploy Frontend**: Deploy frontend to Netlify with Render URL
2. **Test Integration**: Verify frontend can call backend API
3. **Monitor Performance**: Check Render dashboard for usage
4. **Scale if Needed**: Upgrade to paid plan for higher traffic

## Render Free Tier Limits

- **750 hours** per month
- **512MB RAM**
- **Shared CPU**
- **10GB Storage**
- **Automatic HTTPS**
- **Custom domains** (with paid plan)

## Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Community**: [Render Community](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)
