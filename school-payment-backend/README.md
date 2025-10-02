## School Payment Backend

NestJS backend that powers the School Payment dashboard. It exposes REST endpoints for authentication, payment initiation, webhook handling, user management, and transaction queries. The service integrates with MongoDB for persistence and a third-party payment gateway for order processing.

## Tech Stack

- [NestJS](https://nestjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/) ODM (MongoDB)
- JWT authentication
- Axios (via Nest HTTP module) for outbound gateway calls

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance (local/docker/cloud)

## Quick Start

```bash
npm install
cp .env.example .env # then edit the file with your credentials
npm run start:dev
```

The server uses [ConfigModule](https://docs.nestjs.com/techniques/configuration) and validates every required variable at boot. Missing values will stop the application, so be sure to fill in the `.env` file first.

### Environment Variables

| Key | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRY` | Expiration window (e.g. `3600s`, `15m`) |
| `PG_KEY` | Payment gateway key embedded in order payloads |
| `PG_API_KEY` | Symmetric key used to sign gateway requests |
| `PG_API_URL` | Gateway endpoint for creating payments |
| `SCHOOL_ID` | School identifier used while creating orders |

### Running

```bash
# development mode with live reload
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

### Linting & Tests

```bash
npm run lint
npm run test          # unit tests
npm run test:e2e      # e2e tests (requires test env)
npm run test:cov      # coverage report
```

## Project Structure

- `src/auth` – JWT auth module (login route, passport strategy)
- `src/payment` – payment gateway orchestration and webhook handling
- `src/orders` + `src/order-status` – order persistence and status tracking
- `src/transactions` – listing/filtering transaction data
- `src/webhook-logs` – auditing of incoming webhook payloads
- `src/common/filters` – global exception filter for consistent error responses

## Troubleshooting

- **Duplicate index warning**: We've consolidated index definitions so re-running with a clean database removes the warning. If you still see it, ensure MongoDB has dropped legacy indexes (`db.orderstatuses.dropIndexes()` etc.).
- **Env validation error**: Check your `.env` file against `.env.example`. Every key is required.
- **Gateway errors**: The payment flow expects a reachable `PG_API_URL`. For local testing you can mock the endpoint or wire up a stub server.

## License

MIT
