# Quizora Release Notes

## Version 1.0.0
**Date:** 2026-06-02

### 🚀 Major Features
- **Real-Time Multiplayer Arenas:** Complete 1v1 matchmaking utilizing persistent WebSockets.
- **AI Quiz Generation Engine:** Procedural quiz generation integrated directly with the Google Gemini 3.5 Flash SDK.
- **Venture Suite Module:** Added full telemetry, GDPR compliance protocols, and a simulated Stripe sandbox UI.
- **Gamification Mechanics:** Daily streaks, XP, level progression, and leaderboard statistics.

### 🛡️ Security Improvements
- Removed all development fallbacks for critical environment variables (JWT and API keys will now throw hard errors on boot if missing).
- Established multi-tiered IP rate limiting targeting AI invocation endpoints, Auth, and General requests.
- Integrated aggressive Content Security Policy (CSP), `X-Frame-Options`, and `Permissions-Policy`.
- Validated `trust proxy` usage for spoof-proof Client IP extraction.
- Payload injection limits bounded to 10kb; strict XSS regex sanitizers implemented across text boundaries.

### 📦 Deployment Notes
- Build size radically reduced (JS chunk optimized to `~139 KB` gzipped).
- Frontend deployable to Vercel via `vercel.json` SPA rewrite mappings.
- Backend optimally configured for Render/Railway (standalone Node).

### ⚠️ Known Limitations
- The current WebSocket architecture requires a standalone server environment; deploying the Express instance to Vercel Serverless Functions will cause connection drops during multiplayer sessions.
