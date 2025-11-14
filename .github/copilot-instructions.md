# Copilot Instructions for QuickChat (RealtimeChat MernStack)

## Project Overview
- **QuickChat** is a full-stack real-time chat application using the MERN stack (MongoDB, Express, React, Node.js).
- The backend (`backend/`) is an Express API with authentication, messaging, and email integration.
- The frontend (`frontend/`) is a Vite + React SPA.

## Key Architecture & Data Flow
- **Backend**
  - Entry: `backend/src/server.js` (loads env, connects MongoDB, sets up API routes)
  - Auth, user, and message logic in `controllers/`, `models/`, and `routes/`.
  - Email sending (welcome emails) via Resend API (`lib/resend.js`, `emails/emailHandlers.js`).
  - Environment variables loaded via `lib/env.js` (see `.env` for required keys).
  - User model: `models/User.js` (email, password, fullName, profilePic, timestamps).
  - JWT-based authentication, token set as `jwt` cookie.
  - Static frontend served in production from `frontend/dist`.
- **Frontend**
  - Vite + React app (`frontend/`), entry: `src/main.jsx`, main component: `src/App.jsx`.
  - Uses HMR, ESLint, and Vite plugins.

## Developer Workflows
- **Install dependencies:**
  - `npm install` (root) installs both frontend and backend deps via `package.json` scripts.
  - Or: `npm install` in each of `backend/` and `frontend/`.
- **Run backend (dev):**
  - `cd backend && npm run dev` (uses nodemon, watches `server.js`)
- **Run frontend (dev):**
  - `cd frontend && npm run dev` (starts Vite dev server)
- **Build frontend:**
  - `cd frontend && npm run build` (outputs to `frontend/dist/`)
- **Start full app (prod):**
  - `npm run build` (root) then `npm start` (root) or `npm run start --prefix backend`

## Project-Specific Patterns & Conventions
- **Environment config:** All sensitive keys (DB, JWT, Resend, Cloudinary, etc.) are loaded via `lib/env.js` and must be present in `.env`.
- **Email integration:**
  - Welcome emails sent on signup via `sendWelcomeEmail` (see `authController.js`, `emailHandlers.js`).
  - Email templates in `emails/emailTemplates.js`.
- **JWT Auth:**
  - Token is set as an HTTP-only cookie named `jwt`.
  - Auth middleware expects this cookie for protected routes.
- **API routes:**
  - Auth: `/api/auth` (see `routes/authRoute.js`)
  - Messages: `/api/message` (see `routes/messageRoute.js`)
- **Frontend-backend integration:**
  - In production, backend serves static frontend from `frontend/dist`.
  - `ENV.CLIENT_URL` is used in emails for links.

## External Dependencies
- **Backend:** express, mongoose, bcryptjs, jsonwebtoken, dotenv, cloudinary, resend
- **Frontend:** react, vite, @vitejs/plugin-react, eslint

## Examples
- To add a new protected API route, use the JWT cookie and `protectRoute` middleware (see `authRoute.js`).
- To send a new type of transactional email, add a handler in `emails/emailHandlers.js` and a template in `emails/emailTemplates.js`.

---

**For AI agents:**
- Always check `lib/env.js` for required environment variables.
- Follow the backend/frontend separation and use the provided scripts for builds and runs.
- Reference the actual file structure for new features (e.g., new models in `models/`, new routes in `routes/`).
- Use the Resend API for all outgoing emails.
- When in doubt, check `server.js` for backend entry and integration points.
