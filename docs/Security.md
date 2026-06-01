# Security

## Authentication Architecture

### JWT Token Flow
1. User registers/logs in via `POST /api/auth/register-or-login`
2. Server issues:
   - **Access Token** (15-minute expiry) — used for API authorization
   - **Refresh Token** (30-day expiry) — used to obtain new access tokens
3. Access tokens are rotated via `POST /api/auth/refresh`
4. Sessions are tracked server-side for device management

### Session Management
- Each login creates a tracked session with IP, user agent, and timestamps
- Sessions can be individually revoked via `POST /api/auth/sessions/revoke`
- Banned users have all sessions auto-revoked

## Input Validation

### XSS Prevention
All user inputs are sanitized through the `sanitizeString()` function that escapes:
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#x27;`
- `/` → `&#x2F;`
- `&` → `&amp;`

### AI Prompt Injection Prevention
The AI generation endpoint filters inputs against malicious patterns:
- `ignore instructions`
- `system instruction`
- `reveal private key`
- `jailbreak`
- `drop database`

## Security Headers

All responses include:
- `X-Frame-Options: SAMEORIGIN` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` — Legacy XSS protection

## Rate Limiting

Sliding window rate limiting prevents abuse:
- **Global:** 120 requests/minute per IP
- **AI Generation:** 10 requests/5 minutes per IP
- **Token Budget:** 5M tokens/day global cap

## Moderation

- User reporting system with admin review queue
- User blocking (prevents matchmaking between blocked pairs)
- Admin muting (prevents lobby chat)
- Admin banning (permanent account suspension with session revocation)

## Data Protection

- Passwords are not stored (login is username-based for MVP)
- JWT secrets should be configured via environment variables
- Database file (`server_db.json`) is excluded from version control
- No PII is exposed in API responses beyond what users provide

## Recommended Production Hardening

For production deployment beyond MVP:
1. Add HTTPS enforcement via reverse proxy
2. Implement CSRF tokens for state-changing operations
3. Add Helmet.js for comprehensive security headers
4. Implement proper password hashing (bcrypt/argon2)
5. Add request body size limits
6. Implement API key authentication for admin endpoints
7. Add audit logging to external service
8. Implement Content Security Policy headers
