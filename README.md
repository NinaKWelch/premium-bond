# Premium Bonds Tracker

A Next.js frontend for tracking UK NS&I Premium Bond investments and prizes, and calculating your actual effective interest rate.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- NextAuth v5 (Auth.js) — credentials-based authentication with JWT sessions
- MUI v9
- react-hook-form + Zod
- Vitest + Testing Library

## Getting started

### Prerequisites

- Node.js 20+
- The [NinaKWelch/premium-bond-api](https://github.com/NinaKWelch/premium-bond-api) backend running locally

### Environment

Create a `.env` file in the project root:

```
API_BASE_URL=http://localhost:3000/api
AUTH_SECRET=your-secret-here
```

Generate a strong `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Install and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3001` (Next.js uses 3001 if 3000 is taken by the API).

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Type-check and build for production |
| `npm start`          | Run production build                |
| `npm test`           | Run tests                           |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run lint`       | Lint all files                      |
| `npm run format`     | Format all files with Prettier      |

## Features

- **Guest mode** — try the full UI without an account; data is stored in localStorage
- **Authentication** — register or log in; session persists across server and client pages via NextAuth
- **Transactions** — record deposits, withdrawals, and reinvested prizes with date and amount
- **Prizes** — log prizes won each month; optionally mark a prize as reinvested (automatically adds a deposit transaction)
- **Activity** — view, edit, and delete all transactions and prizes in a single chronological list
- **Delete protection** — deposits cannot be deleted if a withdrawal or prize depends on them; the dialog explains what to remove first
- **Results** — calculate year-by-year effective interest rate and overall average
- **Simple calculator** — estimate effective rate from total invested, total prizes, and start date without needing an account
- **Export** — download transactions and prizes as CSV
- **Print** — print a results summary

## Project structure

```
app/                    # Next.js App Router pages and layouts
├── api/auth/           # NextAuth route handler
├── actions.ts          # Server actions (guest mode cookie)
├── dashboard/          # Main tracker page (protected)
├── login/              # Login page
└── register/           # Register page
src/
├── api/                # Fetch wrappers for each backend endpoint
├── components/         # UI components grouped by feature
├── constants/          # Shared numeric and string constants
├── context/            # BondsContext — global state, API and localStorage calls
├── schemas/            # Zod validation schemas (bonds and auth forms)
├── store/              # localStorage store for guest mode
├── types/              # Shared TypeScript types
└── utils/              # Pure utility functions (date helpers, calculator, rate estimator, file download)
auth.ts                 # NextAuth configuration
middleware.ts           # Route protection (redirects unauthenticated users)
```
