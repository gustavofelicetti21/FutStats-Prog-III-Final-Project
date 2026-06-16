# FutStats

FutStats is a web application for managing round-robin football championships.

This repository is organized for the final Programming III project and will be
developed in small feature branches with clear commits.

## Stack

- Node.js
- Express
- Sequelize
- PostgreSQL
- Docker Compose
- Jest
- React and Vite, planned for the frontend stage

## Backend

The backend lives in `backend/` and follows a layered architecture:

```text
Controller -> Service -> Repository -> Model -> Database
```

### Environment Variables

Create a local environment file from the example:

```bash
cd backend
cp .env.example .env
```

Default database values:

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=futstats
DB_USER=futstats
DB_PASSWORD=futstats
```

### Install Dependencies

```bash
cd backend
npm install
```

### Start PostgreSQL

```bash
cd backend
docker compose up -d
```

The Docker database uses:

```text
database: futstats
user: futstats
password: futstats
port: 5432
```

### Run Migrations and Seeds

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### Run the API

Development mode:

```bash
cd backend
npm run dev
```

Production-like mode:

```bash
cd backend
npm start
```

Health check:

```text
GET /health
```

### Authentication

The administrator user is created by the initial seed:

```text
email: admin@futstats.com
password: admin123
```

Login route:

```text
POST /auth/login
```

Authenticated routes must use:

```text
Authorization: Bearer <token>
```

### Available Scripts

Run from `backend/`:

```text
npm run dev        start the API with nodemon
npm start          start the API with node
npm test           run Jest tests
npm run db:migrate run Sequelize migrations
npm run db:seed    run Sequelize seeders
```

### Backend Structure

```text
backend/
  src/
    config/
    controllers/
    database/
      migrations/
      seeders/
    middlewares/
    models/
    repositories/
    routes/
    services/
    utils/
    app.js
    server.js
  tests/
  docker-compose.yml
  package.json
  .env.example
```

### Team Routes

Public routes:

```text
GET /teams
GET /teams/:id
```

Private routes:

```text
POST /teams
PUT /teams/:id
DELETE /teams/:id
PATCH /teams/:id/deactivate
```

## Git Workflow

Suggested branches:

```text
main
develop
gustavo/project-setup
gustavo/backend-setup-docs
```

Commit messages should be written in English, for example:

```text
chore: create initial backend structure
feat: add JWT authentication
docs: add backend setup instructions
```
