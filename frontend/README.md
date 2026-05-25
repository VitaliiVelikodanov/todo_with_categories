# Frontend

React + TypeScript todo client.

See the [root README](../README.md) for setup, Docker, and deployment instructions.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint

## Environment

Copy `.env.example` to `.env` if you want to override the default API base.

By default the frontend uses `/backend`, and the Vite dev server proxies that path to `http://localhost:3000`.
