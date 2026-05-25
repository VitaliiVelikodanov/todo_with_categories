# Todo With Categories

Full-stack task manager with category grouping, undo notifications, and a 5-tasks-per-category limit.

## Stack

- **Frontend:** React, TypeScript, Redux Toolkit, React Hook Form, Axios, Tailwind CSS, Vite
- **Backend:** NestJS, TypeScript, Prisma, SQLite
- **Infrastructure:** Docker Compose, Vercel Services

## Project structure

```text
frontend/   React client
backend/    NestJS API
```

## API

| Method   | Route              | Description                           |
| -------- | ------------------ | ------------------------------------- |
| `GET`    | `/todos?category=` | List todos (optional category filter) |
| `POST`   | `/todos`           | Create todo                           |
| `PATCH`  | `/todos/:id`       | Update completion status              |
| `DELETE` | `/todos/:id`       | Delete todo                           |
| `GET`    | `/categories`      | List categories                       |

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

- Backend: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:5173](http://localhost:5173)

The frontend calls `/backend/*` in every environment. In local development, Vite proxies `/backend` to the Nest server on port `3000`.

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Run with Docker

```bash
docker compose up --build
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:8080](http://localhost:8080)

SQLite data is persisted in the `sqlite_data` Docker volume.

## Environment variables

| Variable       | App      | Default              |
| -------------- | -------- | -------------------- |
| `DATABASE_URL` | backend  | `file:./data.sqlite` |
| `PORT`         | backend  | `3000`               |
| `CORS_ORIGIN`  | backend  | unset                |
| `VITE_API_URL` | frontend | `/backend`           |

## Scripts

| Command                  | Description              |
| ------------------------ | ------------------------ |
| `npm run dev`            | Start backend + frontend |
| `npm run build`          | Build backend + frontend |
| `npm run build:backend`  | Build the NestJS backend |
| `npm run build:frontend` | Build the Vite frontend  |
| `npm run lint`           | Lint frontend            |
| `npm run test:backend`   | Run backend unit tests   |

## Features

- Create todos with text and category
- Category-grouped list with per-category count (`3/5`)
- Mark tasks complete individually or in bulk
- Filter by category, status, and search query
- Undo snackbar on complete and delete (5 second delay before removal)
- Loading, error, and empty states

## Deployment

This repository is configured for **Vercel Services**:

1. Frontend service at `/`
2. Backend service at `/backend`

`frontend/.env.production` sets `VITE_API_URL=/backend`, so the production frontend talks to the backend through Vercel routing instead of a hardcoded host.

The backend listens on `process.env.PORT || 3000` and accepts optional `CORS_ORIGIN` values when you need a different browser origin.

If `DATABASE_URL` is not set at runtime, the backend falls back to SQLite at `file:/tmp/data.sqlite` on Vercel. That fallback is suitable for smoke tests and demos only because it is ephemeral. For persistent data, set `DATABASE_URL` in the Vercel project settings to a managed database.

## Tests

Backend unit tests cover the 5-task-per-category rule:

```bash
npm run test:backend
```
