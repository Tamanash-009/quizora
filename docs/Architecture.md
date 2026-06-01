# Architecture

## System Overview

Quizora is a full-stack quiz platform built as a monorepo with a React SPA frontend and Express.js backend, deployed as a single process.

```
┌─────────────────────────────────────────────┐
│                  Client                      │
│  React 19 + TailwindCSS v4 + Vite           │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Auth    │ │Dashboard │ │  Quiz Play   │  │
│  │Component │ │Component │ │  Component   │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │Creator  │ │Leaderboard│ │  Multiplayer │  │
│  │ Tools   │ │Component │ │  WebSocket   │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
└─────────────────┬───────────────────────────┘
                  │ HTTP / WebSocket
┌─────────────────▼───────────────────────────┐
│               Server (Express.js)            │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ REST API │ │ WebSocket│ │  Gemini AI   │  │
│  │ Routes   │ │ Lobbies  │ │  Integration │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │   Auth   │ │Rate Limit│ │  Moderation  │  │
│  │   JWT    │ │Middleware│ │  Pipeline    │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │        JSON File Database              │  │
│  │     (server_db.json — persistent)      │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Folder Structure

```
quizora/
├── src/                    # Frontend React application
│   ├── App.tsx             # Main application router & state
│   ├── main.tsx            # React entry point + PWA registration
│   ├── index.css           # Global styles + design system
│   ├── types.ts            # TypeScript type definitions
│   ├── initialData.ts      # Seed quiz data (25+ quizzes)
│   └── components/         # Feature components
│       ├── Header.tsx       # Navigation bar
│       ├── Auth.tsx         # Login/register
│       ├── Dashboard.tsx    # Quiz discovery
│       ├── QuizPlay.tsx     # Quiz taking engine
│       ├── QuizCreate.tsx   # Quiz creation (manual + AI)
│       ├── Scoreboard.tsx   # Personal analytics
│       ├── Leaderboard.tsx  # Global rankings
│       ├── UserProfile.tsx  # Profile management
│       ├── AdminPanel.tsx   # Admin dashboard
│       ├── MemeGenerator.tsx # Score meme creator
│       ├── VentureStartupSuite.tsx  # Business analytics
│       └── AboutContactReviews.tsx  # Static pages
├── server.ts               # Express + WebSocket server
├── public/                 # Static assets
│   ├── assets/             # Icons, images
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Offline support
│   ├── robots.txt          # SEO
│   └── sitemap.xml         # Search engine sitemap
├── tests/                  # Test suite
├── docs/                   # Documentation
├── .github/                # CI/CD workflows
├── index.html              # HTML entry point
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## Design Decisions

### 1. Monorepo Single-Process Architecture
The frontend and backend share a single Node.js process. In development, Vite runs as middleware inside Express. In production, Vite builds static assets served by Express.

**Rationale:** Simplifies deployment to a single Vercel serverless function, eliminates CORS issues, and reduces infrastructure complexity for an MVP.

### 2. JSON File Database
Uses a flat JSON file (`server_db.json`) for persistence instead of a traditional database.

**Rationale:** Zero external dependencies for deployment. Suitable for MVP/portfolio demonstration. Data is persisted across restarts but can be easily migrated to PostgreSQL/MongoDB by replacing the `loadDB`/`saveDB` functions.

### 3. JWT Authentication
Stateless JWT tokens with 15-minute access tokens and 30-day refresh tokens. Sessions are tracked server-side for device management.

**Rationale:** Standard auth pattern. Access tokens are short-lived for security. Refresh tokens enable persistent sessions without re-authentication.

### 4. WebSocket Multiplayer
Real-time quiz battles use native WebSocket with a custom lobby/matchmaking system.

**Rationale:** WebSocket provides low-latency bidirectional communication essential for real-time multiplayer. The custom lobby system supports matchmaking, spectating, and anti-cheat validation.

### 5. Gemini AI Integration
Quiz generation uses Google's Gemini 3.5 Flash model with structured JSON output via response schema.

**Rationale:** Structured output ensures consistent quiz format. Rate limiting and caching prevent cost overruns. Content moderation filters block prompt injection attacks.

### 6. Neo-Brutalist Design System
Bold borders, offset shadows, high contrast, and expressive typography using Space Grotesk + JetBrains Mono.

**Rationale:** Distinctive visual identity that stands out from generic UI frameworks. The design system is defined in `index.css` with reusable utility classes.
