# API Reference

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://quizora.vercel.app/api`

## Authentication

### Register or Login
```
POST /api/auth/register-or-login
```

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (optional)",
  "avatarUrl": "string (optional)",
  "bio": "string (optional)"
}
```

**Response:**
```json
{
  "user": { "id": "string", "username": "string", "role": "string", ... },
  "accessToken": "string (JWT, 15min)",
  "refreshToken": "string (JWT, 30d)",
  "sessionId": "string"
}
```

### Refresh Token
```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "string (required)",
  "sessionId": "string (required)"
}
```

**Response:**
```json
{
  "accessToken": "string (new JWT)"
}
```

### List Sessions
```
GET /api/auth/sessions?userId={userId}
```

### Revoke Session
```
POST /api/auth/sessions/revoke
```

**Request Body:**
```json
{
  "sessionId": "string"
}
```

---

## Quiz Operations

### List All Quizzes
```
GET /api/quizzes
```

**Response:** Array of Quiz objects.

### Create Quiz
```
POST /api/quizzes/create
```

**Request Body:**
```json
{
  "quiz": {
    "title": "string (required)",
    "description": "string",
    "category": "string",
    "timeLimit": "number (seconds)",
    "isPublic": "boolean",
    "difficulty": "easy | medium | hard",
    "questions": [
      {
        "text": "string",
        "questionType": "mcq | tf",
        "points": "number",
        "options": [
          { "text": "string", "isCorrect": "boolean" }
        ]
      }
    ]
  }
}
```

### AI Quiz Generation
```
POST /api/gemini/generate
```

**Request Body:**
```json
{
  "topic": "string (required)",
  "difficulty": "easy | medium | hard",
  "questionCount": "number (default: 3)"
}
```

**Response:** Generated Quiz object.

**Rate Limit:** 10 requests per 5 minutes per IP.

---

## Attempts

### List All Attempts
```
GET /api/attempts
```

### Log Attempt
```
POST /api/attempts/log
```

**Request Body:**
```json
{
  "attempt": {
    "userId": "string",
    "username": "string",
    "quizId": "string",
    "quizTitle": "string",
    "category": "string",
    "score": "number",
    "totalPoints": "number",
    "timeTaken": "number (seconds)"
  }
}
```

---

## Moderation

### Report Content
```
POST /api/moderation/report
```

**Request Body:**
```json
{
  "targetId": "string (required)",
  "targetType": "quiz | user",
  "reason": "string (required)",
  "reportedBy": "string"
}
```

### Block User
```
POST /api/moderation/block
```

### Mute User (Admin)
```
POST /api/moderation/mute
```

---

## Admin

All admin endpoints require `adminKey: "MASTER_SECRET"` in query/body.

### Get Metrics
```
GET /api/admin/metrics?adminKey=MASTER_SECRET
```

### Ban User
```
POST /api/admin/ban
```

### Toggle Feature Flag
```
POST /api/admin/feature-flag/toggle
```

### Delete Quiz (Moderator)
```
POST /api/admin/delete-quiz-moderator
```

---

## Payments (Sandbox)

### Create Checkout
```
POST /api/payments/create-checkout
```

### Stripe Webhook
```
POST /api/payments/stripe-webhook
```

### Billing Portal
```
GET /api/payments/billing-portal?userId={userId}
```

### Cancel Subscription
```
POST /api/payments/cancel-subscription
```

---

## WebSocket API

Connect to `ws://localhost:3000` (or `wss://` in production).

### Messages (Client → Server)

| Type | Payload | Description |
|------|---------|-------------|
| `join_matchmaking` | `{ userId, username, avatarUrl }` | Join multiplayer queue |
| `submit_multiplier_answer` | `{ roomId, userId, selectedOptionId, questionIndex, isCorrect, pointsEarned }` | Submit answer |
| `join_spectator` | `{ roomId }` | Watch a live match |
| `chat_chat_lobby` | `{ roomId, username, text }` | Send lobby chat |

### Messages (Server → Client)

| Type | Description |
|------|-------------|
| `matchmaking_waiting` | Waiting in queue |
| `match_found` | Match paired, game starting |
| `new_question` | Next question delivered |
| `timer_tick` | Countdown update |
| `reveal_correct_answer` | Answer revealed |
| `player_status_updated` | Score update |
| `match_ended` | Game over with results |
| `heartbeat` | Keep-alive ping |

---

## Rate Limits

| Scope | Limit | Window |
|-------|-------|--------|
| Global | 120 requests | 1 minute |
| AI Generation | 10 requests | 5 minutes |
| Token Daily | 5,000,000 tokens | 24 hours |
