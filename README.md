# AI-Driven Learning Platform

A mini learning platform where users select topics, send prompts to an AI, and receive generated lessons. Includes a REST API backend, PostgreSQL database, AI integration (OpenAI or mock), and a React dashboard.

## Technologies Used

**Backend**
- Node.js + TypeScript + Express
- Prisma ORM + PostgreSQL
- JWT authentication (bcryptjs)
- OpenAI GPT API (with mock fallback)
- Swagger/OpenAPI docs
- express-validator

**Frontend**
- React 18 + TypeScript + Vite
- React Router v6
- Axios
- react-markdown

**Infrastructure**
- Docker Compose (PostgreSQL)

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB models
│   │   └── seed.ts             # Seed categories + admin user
│   └── src/
│       ├── controllers/        # Request handlers
│       ├── middleware/         # JWT auth middleware
│       ├── routes/             # Express routers + Swagger docs
│       ├── services/           # AI service (OpenAI / mock)
│       └── index.ts            # App entry point
├── frontend/
│   └── src/
│       ├── api/                # Axios API calls
│       ├── components/         # Navbar, AuthContext
│       ├── pages/              # Register, Login, Learn, History, Admin
│       └── types/              # Shared TypeScript types
└── docker-compose.yml
```

## Setup & Run Locally

### Prerequisites
- Node.js 18+
- Docker Desktop (for the database)

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env if needed (see below)
npm install
npm run db:migrate    # Creates tables
npm run db:seed       # Seeds categories + admin user
npm run dev           # Starts on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Starts on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_learning"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
OPENAI_API_KEY="your-openai-api-key"
PORT=3001
USE_AI_MOCK=true
```

- Set `USE_AI_MOCK=false` and provide a real `OPENAI_API_KEY` to use actual GPT responses.
- With `USE_AI_MOCK=true`, a structured mock lesson is returned (no API key needed).

## Default Admin Account

After seeding, an admin account is created:
- **Phone:** `0000000000`
- **Password:** `admin123`

## API Documentation

Swagger UI is available at: **http://localhost:3001/api/docs**

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/categories` | — | List categories + sub-categories |
| POST | `/api/prompts` | User | Submit prompt, get AI lesson |
| GET | `/api/prompts/history` | User | Get own learning history |
| GET | `/api/admin/users` | Admin | List all users (search + pagination) |
| GET | `/api/admin/users/:id/prompts` | Admin | Get a user's prompt history |

## Assumptions

- Phone number is used as the unique login identifier (no SMS verification).
- Categories and sub-categories are pre-seeded; users cannot create them.
- The AI mock response is deterministic and structured for demo purposes.
- Admin role is assigned manually (via seed or direct DB update).
