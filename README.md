# Remote Classes for Rural Colleges

A full-stack starter application for organizing online classes and learning resources for colleges with limited connectivity.

## Features
- Student and teacher registration/login using JWT.
- Teachers can create classes with a subject, description, meeting URL, and resource URL.
- Students can browse classes.
- Low-bandwidth-friendly interface with simple layouts and links rather than embedded video.

## Stack
React (Vite), Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs.

## Requirements
Node.js 18+ and a MongoDB connection string (local MongoDB or MongoDB Atlas).

## Run locally
### Backend
```bash
cd server
cp .env.example .env
# Add your MongoDB URI and a long JWT secret to server/.env
npm install
npm run dev
```

### Frontend
In another terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal. The frontend expects the API at `http://localhost:5000/api` by default.

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/classes` (authenticated)
- `POST /api/classes` (teacher only)

## Notes and limitations
This is a learning-project starter, not a production-ready learning management system. Meeting and resource links are externally hosted URLs; the app does not itself stream live video or store uploaded recordings. Before deployment, add HTTPS, stronger validation, rate limiting, password reset, email verification, audit logging, and production secret management.
