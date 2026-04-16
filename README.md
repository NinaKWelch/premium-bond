# Premium Bonds Tracker

A React frontend for tracking UK NS&I Premium Bond investments and prizes, and calculating your actual effective interest rate.

## Tech stack

- React 19 + TypeScript
- Vite
- MUI v9
- react-hook-form
- Vitest + Testing Library

## Getting started

### Prerequisites

- Node.js 20+
- The [NinaKWelch/premium-bond-api](https://github.com/NinaKWelch/premium-bond-api) backend running locally

### Environment

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:3000
```

### Install and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview production build            |
| `npm test`           | Run tests                           |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run lint`       | Lint all files                      |
| `npm run format`     | Format all files with Prettier      |

## Features

- **Transactions** — record deposits and withdrawals with date and amount
- **Prizes** — log prizes won each month; optionally mark a prize as reinvested (automatically adds a deposit transaction)
- **Activity** — view, edit, and delete all transactions and prizes in one list
- **Results** — calculate year-by-year effective interest rate and overall average
- **Simple calculator** — estimate effective rate from total invested, total prizes, and start date without needing the backend
- **Export** — download transactions and prizes as CSV
- **Print** — print a results summary

## Project structure

```
src/
├── api/            # Fetch wrappers for each backend endpoint
├── components/     # UI components grouped by feature
├── constants/      # Shared numeric and string constants
├── context/        # BondsContext — global state and API calls
├── types/          # Shared TypeScript types
└── utils/          # Pure utility functions (date helpers, rate estimator, file download)
```
