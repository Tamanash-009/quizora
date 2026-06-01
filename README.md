# Quizora ⚡️

> **The next-generation AI-powered quiz platform.** Build procedural quizzes using Google Gemini, battle friends in real-time multiplayer arenas, and scale your learning with built-in gamification.

![Landing Page](./public/screenshots/landing-page.png)

## 🌟 Project Overview
Quizora transforms traditional studying into a highly engaging, competitive experience. Utilizing a modern Neo-Brutalist design language, Quizora offers real-time 1v1 matchmaking, procedurally generated AI quizzes, and an expansive gamification suite to keep learners engaged and challenged.

## ✨ Key Features
- **Real-Time Multiplayer Arenas (1v1):** Challenge friends or matchmake globally. Answer under pressure, see live score multipliers, and assert dominance.
- **Venture Suite Dashboard:** Advanced telemetry, performance monitoring, GDPR compliance, and Stripe billing simulation built right into the platform.
- **Anti-Cheat Proctoring:** Automatic tab-switch detection, time-penalties, and security alerts to ensure fair play.

### 🤖 AI Quiz Generation
Enter any niche topic, and our integrated Google Gemini 3.5 Flash engine will procedurally synthesize a complete quiz (questions, options, and difficulty scaling) in seconds.

### 🎮 Gamification
- Daily XP streaks, badges, trophies, and a dynamic global leaderboard.
- Dynamic skill progression trees and custom avatars.

### ⚔️ Multiplayer
- Instant global matchmaking over lightweight WebSockets.
- Real-time score streaming, taunts, and game-over resolutions.

### 📱 PWA Features
- Progressive Web App compatible with full `manifest.json` and service worker integration.
- Offline-ready caching and install-to-home-screen functionality for a native mobile experience.

### 🛡️ Security Features
- Strict zero-trust JWT backend implementation.
- Multi-tiered IP rate-limiting to prevent DDOS and AI billing exhaustion.
- Deep XSS sanitization and strict Content Security Policy (CSP).

---

## 📸 Screenshots

| Dashboard | Quiz Play |
| --- | --- |
| ![Dashboard](./public/screenshots/dashboard.png) | ![Quiz Play](./public/screenshots/quiz-play.png) |

| Quiz Creator | Venture Suite |
| --- | --- |
| ![Quiz Create](./public/screenshots/quiz-create.png) | ![Venture Suite](./public/screenshots/venture-suite.png) |

| User Profile | Global Leaderboard |
| --- | --- |
| ![Profile](./public/screenshots/profile.png) | ![Leaderboard](./public/screenshots/leaderboard.png) |

| Mobile View | Dark Mode |
| --- | --- |
| ![Mobile View](./public/screenshots/mobile-view.png) | ![Dark Mode](./public/screenshots/dark-mode.png) |

---

## 🏛 Architecture Overview
Quizora is divided into a blazing-fast Client-Side Rendered (CSR) React Vite frontend and a highly secure Express Node.js backend. State is seamlessly synchronized across clients via WebSockets, while the Gemini API is isolated securely on the backend.

### 🛠 Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express.js, WebSockets (`ws`)
- **AI Integration:** Google GenAI SDK (Gemini)
- **Deployment:** Vercel (Frontend Edge), Render (Backend Node)

### 📂 Project Structure
```text
├── public/               # PWA assets & static files
├── src/
│   ├── components/       # Reusable React UI components
│   ├── types.ts          # Core Typescript schemas
│   ├── index.css         # Global Neo-Brutalist design tokens
│   └── App.tsx           # Primary routing & state orchestration
├── docs/                 # Extended technical documentation
├── tests/                # Build and unit validation
├── server.ts             # Express & WebSocket backend engine
└── vercel.json           # Cloud deployment routing config
```

---

## 🚀 Installation Guide

### Local Development
1. Clone the repository: `git clone https://github.com/yourusername/quizora.git`
2. Enter directory: `cd quizora`
3. Install dependencies: `npm install`
4. Setup environment variables (see below)
5. Start development server: `npm run dev`

### Environment Variables
Copy `.env.example` to `.env` and configure:
```env
# Required: Procured from Google AI Studio
GEMINI_API_KEY="your_api_key_here"

# Required: Cryptographically secure random string
JWT_SECRET="your_jwt_secret_here"

PORT=3000
```

### Production Deployment
Quizora can be deployed to modern cloud providers seamlessly:
1. **Frontend (Vercel):** The repository includes a `vercel.json` optimized for Vercel's edge network (`npm run build`).
2. **Backend (Render/Railway):** Due to persistent WebSockets, run the Node environment standalone (`npm run build && npm run start`).

---

## ⚡ Performance Optimizations
- **Gzip Chunking:** Frontend payloads compressed to `< 140KB`.
- **In-Memory Caching:** AI requests are hashed and cached to reduce duplicate Gemini API calls.

## 🔐 Security Measures
- Dynamic API payload chunking (`10kb` limit).
- Express `trust proxy` enabled for spoof-proof IP extraction.
- JWT and API keys strictly enforce throw-on-fail during startup to prevent fallback exposures.

## 🔮 Future Improvements
- Migration from local JSON database to PostgreSQL + Prisma.
- Scalable Redis pub/sub integration for multi-instance WebSocket horizontal scaling.

---

## 🤝 Contributing
Contributions are highly encouraged! Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🙌 Credits
Designed and engineered by the Quizora Open Source Team. Powered by React, Vite, and Google Gemini.
