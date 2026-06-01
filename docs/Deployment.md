# Deployment Guide

## Prerequisites

- Node.js 20+ installed
- npm 9+ installed
- A Gemini API key ([get one here](https://aistudio.google.com/apikey))

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/quizora.git
cd quizora

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env and add your API keys
# GEMINI_API_KEY=your_key_here
# JWT_SECRET=your_secret_here

# 5. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Vercel Deployment

### Option 1: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the following:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add Environment Variables:
   - `GEMINI_API_KEY` — your Gemini API key
   - `JWT_SECRET` — a strong random secret
5. Click Deploy

### Vercel Configuration

The project includes a `vercel.json` for proper routing:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI quiz generation |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment mode (development/production) |

## Troubleshooting

### Build fails with TypeScript errors
```bash
npm run lint  # Check for type errors
```

### Service worker not updating
Clear browser cache and service worker:
1. Open DevTools → Application → Service Workers
2. Click "Unregister"
3. Hard refresh (Ctrl+Shift+R)

### API routes return 500
Ensure `GEMINI_API_KEY` is set in your environment variables.
