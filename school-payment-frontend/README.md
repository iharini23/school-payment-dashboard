# School Payment Frontend

A responsive React + Vite dashboard for managing the School Payment platform. It provides authentication, payment creation, and transaction monitoring screens that integrate with the NestJS backend API.

## Prerequisites

- Node.js 18+
- The backend service running locally on port `3000` (see `school-payment-backend`)

## Getting started

```powershell
cd school-payment-frontend
npm install
npm run dev
```

The development server runs at <http://localhost:5173>. To point the UI to a different backend origin, create a `.env` file based on `.env.example`:

```
cp .env.example .env
# update VITE_API_BASE_URL if needed
```

## Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Start Vite in development mode           |
| `npm run build`| Type-check and build for production      |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the `src` directory    |

## Architecture

- **Routing**: React Router with protected routes based on JWT session state
- **State**: Lightweight auth context backed by `localStorage`; data fetching via Axios
- **UI**: Tailored utility classes for a dark dashboard aesthetic; reusable table and status badges
- **Forms**: `react-hook-form` for ergonomic form handling and validation

## Folder structure

```
school-payment-frontend/
  src/
    api/                // REST client wrappers
    components/         // Reusable UI components
    context/            // Auth provider
    hooks/              // Custom React hooks
    pages/              // Route components
    styles/             // Global styles
    types/              // Shared TypeScript types
```

## Next steps

- Add unit tests with Vitest/RTL
- Introduce toast notifications for async feedback
- Wire role-based access once backend supports it
