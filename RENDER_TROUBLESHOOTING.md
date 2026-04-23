# Render Deployment Troubleshooting

## Current Error
```
Root directory "server" does not exist. Verify the Root Directory configured in your service settings.
```

## Solutions to Try

### Solution 1: Use Root Directory (Recommended)
Move render.yaml to server directory and configure Render to use server as root:

1. **Delete root-level render.yaml:**
   ```bash
   rm render.yaml
   ```

2. **Keep only server/render.yaml** (already configured)

3. **In Render Dashboard:**
   - Go to your service settings
   - Set "Root Directory" to: `server`
   - Or leave it empty if render.yaml is in server/

### Solution 2: Move Files to Root
If the server directory doesn't exist on GitHub:

1. **Check your repository structure on GitHub**
2. **If server/ directory is missing:**
   ```bash
   git add server/
   git commit -m "Add server directory"
   git push origin main
   ```

### Solution 3: Manual Configuration
In Render Dashboard, set:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Solution 4: Use GitHub Actions
Create `.github/workflows/deploy.yml` for deployment:

```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## Verification Steps

1. **Check GitHub Repository:**
   - Visit your repo on GitHub
   - Verify `server/` directory exists
   - Verify `server/server.js` exists

2. **Check Render Service Settings:**
   - Go to Render dashboard → Your service
   - Check "Root Directory" field
   - Should be either `server` or empty

3. **Check render.yaml Location:**
   - Should be in the same directory as package.json
   - Currently: `server/render.yaml`

## Quick Fix

The most likely fix is to set the Root Directory in Render dashboard to `server`:

1. Go to Render dashboard
2. Click your service
3. Go to Settings
4. Find "Root Directory" field
5. Enter: `server`
6. Save and redeploy

## Alternative: Use Manual Deploy

If render.yaml continues to cause issues, deploy manually:

1. In Render dashboard:
   - Connect GitHub repository
   - Set Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables:
     - `NODE_ENV=production`
     - `PORT=10000`
     - `OPENROUTER_API_KEY=your_key_here`
