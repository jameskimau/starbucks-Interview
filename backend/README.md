# Inbox Rules Mini-Automation Builder — Backend

## Setup

Create an env file (this repo can’t include `.env*` files here, so we ship `env.example`):

```bash
cp env.example .env
```

Then edit `.env` as needed:

- `MONGO_URI` (required)
- `PORT` (optional, default 4000)

## Run

```bash
npm run dev
```

## API

- `POST /api/rules`
- `GET /api/rules`
- `PATCH /api/rules/:id/toggle`
- `POST /api/simulate`

