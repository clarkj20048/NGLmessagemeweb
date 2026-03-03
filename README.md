# NGL-Style Anonymous Messaging App

Full-stack web app with:

- Public anonymous message form
- Backend API with MongoDB
- JWT-protected admin login and message dashboard

## Project Structure

- `frontend/` - React (Vite) client UI
- `backend/` - Express API
  - `models/` - Mongoose models
  - `routes/` - API routes
  - `middleware/` - auth middleware
  - `server.js` - app entry point

## Features Implemented

- Public form fields:
  - Full Name (required, must include at least 2 words)
  - Anonymous Display Name (required)
  - Message (required)
- Frontend validation with clear error messages
- Backend validation + sanitization for all incoming data
- `POST /api/messages` stores:
  - `fullName`
  - `anonymousName`
  - `message`
  - `createdAt`
- Full Name is hidden from public responses
- Admin auth:
  - `POST /api/admin/login` returns JWT on successful login
  - bcrypt-hashed password in DB
  - `GET /api/admin/messages` protected by JWT
  - returns full details only to authenticated admin
- CORS enabled
- Environment variables for DB connection, JWT secret, and admin seed credentials
- Responsive dark-themed UI

## Local Setup

1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Configure environment variables

Backend:

- Copy `backend/.env.example` to `backend/.env`
- Update values as needed

Frontend:

- Copy `frontend/.env.example` to `frontend/.env`

3. Start MongoDB

- Ensure MongoDB is running locally (or use a cloud URI and update `MONGO_URI`)

4. Seed admin credentials

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run:

```bash
cd backend
npm run seed:admin
```

5. Run backend

```bash
cd backend
npm run dev
```

6. Run frontend

```bash
cd frontend
npm run dev
```

7. Use the app

- Public form: `http://localhost:5173/` or `http://localhost:5173/u/yourname`
- Admin login: `http://localhost:5173/admin/login`
- Admin dashboard: `http://localhost:5173/admin/dashboard`

## API Summary

### Public

- `POST /api/messages`
  - Body:

```json
{
  "fullName": "Juan Dela Cruz",
  "anonymousName": "TruthTeller99",
  "message": "You are doing great!"
}
```

### Admin

- `POST /api/admin/login`
  - Body:

```json
{
  "email": "admin@example.com",
  "password": "ChangeThisPassword123!"
}
```

- `GET /api/admin/messages`
  - Header: `Authorization: Bearer <token>`
