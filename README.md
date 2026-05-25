# Todo With Categories

Full-stack task manager with category grouping, undo notifications, and a 5-tasks-per-category limit.

## Stack

- **Frontend:** React, TypeScript, Redux Toolkit, React Hook Form, Axios, Tailwind CSS, Vite
- **Backend:** NestJS, TypeScript, Prisma, SQLite
- **Infrastructure:** Docker Compose

## Project structure

```text
frontend/   React client
backend/    NestJS API
```

## API

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/todos?category=` | List todos (optional category filter) |
| `POST` | `/todos` | Create todo |
| `PATCH` | `/todos/:id` | Update completion status |
| `DELETE` | `/todos/:id` | Delete todo |
| `GET` | `/categories` | List categories |

Business rule: each category may contain at most **5 tasks**. Creating a 6th task returns `400 Bad Request`.

## Run locally

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Prepare the database

```bash
npm run prisma:generate --prefix backend
npm run prisma:push --prefix backend
```

### 4. Start both apps

```bash
npm run dev
```

- Backend: [http://localhost:3001](http://localhost:3001)
- Frontend: [http://localhost:5173](http://localhost:5173)

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Run with Docker

```bash
docker compose up --build
```

- Backend: [http://localhost:3001](http://localhost:3001)
- Frontend: [http://localhost:8080](http://localhost:8080)

SQLite data is persisted in the `sqlite_data` Docker volume.

## Environment variables

| Variable | App | Default |
|----------|-----|---------|
| `DATABASE_URL` | backend | `file:./data.sqlite` |
| `PORT` | backend | `3001` |
| `VITE_API_URL` | frontend | `http://localhost:3001` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend |
| `npm run build` | Build frontend |
| `npm run lint` | Lint frontend |
| `npm run test --prefix backend` | Run backend unit tests |

## Features

- Create todos with text and category
- Category-grouped list with per-category count (`3/5`)
- Mark tasks complete individually or in bulk
- Filter by category, status, and search query
- Undo snackbar on complete and delete (5 second delay before removal)
- Loading, error, and empty states

## Deployment

Deploy as two services:

1. **Backend** — Render, Railway, Fly.io, or similar Node host
2. **Frontend** — Vercel, Netlify, or static hosting

Set `VITE_API_URL` to your deployed backend URL when building the frontend.

GitHub Pages alone cannot host the Node.js API; use a separate backend host.

## Tests

Backend unit tests cover the 5-task-per-category rule:

```bash
npm run test --prefix backend
```
