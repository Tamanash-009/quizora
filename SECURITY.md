# Security Policy

## Supported Versions

Currently, only the `main` branch (`v1.x`) is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Quizora very seriously. If you discover a security vulnerability within Quizora, please send an e-mail to our security team (security@quizora.com) instead of opening a public issue.

All security vulnerabilities will be promptly addressed. Please allow up to 48 hours for a response.

## Security Practices
- Quizora implements rate limiting on AI endpoints.
- Environment variables must never be committed to source control.
- Ensure the Gemini API key is isolated to backend services only.
