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

### Initial Setup

```bash
cd backend
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

The API health check will be available at:

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
```

Commit messages should be written in English, for example:

```text
chore: create initial backend structure
feat: add JWT authentication
```
