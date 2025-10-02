# Copilot Instructions for RealtimeChat MERN Stack

## Project Overview
- **Architecture:**
  - Monorepo with `backend` (Node.js/Express/MongoDB) and `frontend` (React/Vite) folders.
  - Backend exposes REST APIs for authentication and messaging, and serves the frontend in production.
  - MongoDB is used for user data; JWT for authentication; emails sent via Resend API.

## Key Directories & Files
- `backend/src/server.js`: Express app entry point, connects to MongoDB, sets up API routes, serves frontend in production.
- `backend/src/controllers/`: Route logic (e.g., `authController.js` for signup, uses email and JWT helpers).
- `backend/src/models/User.js`: Mongoose user schema (fields: email, password, fullName, profilePic).
- `backend/src/lib/utils.js`: JWT token generation and cookie setup.
- `backend/src/emails/`: Email sending (`emailHandlers.js`) and HTML templates (`emailTemplates.js`).
- `frontend/`: Vite + React app, entry at `src/main.jsx` and `src/App.jsx`.

## Developer Workflows
- **Install dependencies:**
  - `npm install` (root) — installs both backend and frontend deps via root `build` script.
- **Start backend (dev):**
  - `npm run dev --prefix backend` (uses nodemon, watches `server.js`).
- **Start frontend (dev):**
  - `npm run dev --prefix frontend` (starts Vite dev server).
- **Build frontend:**
  - `npm run build --prefix frontend` (outputs to `frontend/dist`).
- **Production start:**
  - `npm run start` (root) — runs backend, which serves built frontend if `NODE_ENV=production`.

## Patterns & Conventions
- **API routes:**
  - Auth: `/api/auth` (see `authRoute.js`)
  - Messages: `/api/message` (see `messageRoute.js`)
- **Environment variables:**
  - Backend expects `.env` with `PORT`, `MONGODB_URI`, `JWT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `CLIENT_URL`.
- **JWT Auth:**
  - Token is set as `jwt` cookie (see `generateToken` in `utils.js`).
- **Email:**
  - Welcome email sent on signup (see `sendWelcomeEmail` in `emailHandlers.js`).
- **Frontend:**
  - Uses React 19, Vite, and ESLint with custom config (`eslint.config.js`).

## Integration Points
- **Backend/Frontend integration:**
  - In production, backend serves static files from `frontend/dist`.
- **External services:**
  - MongoDB (via `mongoose`)
  - Resend API for transactional emails

## Notable Deviations
- The backend and frontend are linked via local file dependency (`realtimechat-mernstack: file:..`) in both `package.json` files.
- No test scripts are implemented yet.

---

**For AI agents:**
- Follow the established folder structure and naming conventions.
- Use async/await for all database and network operations.
- When adding new API endpoints, register them in `server.js` and create a corresponding controller.
- For new user flows, update both backend (API, model, email) and frontend (React components, API calls) as needed.
- Reference this file and `server.js` for integration patterns.
