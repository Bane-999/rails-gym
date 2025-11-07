# Rails Gym — Backend

Rails 8 API that orchestrates Docker execution of user-submitted code.

## Responsibilities

- Store exercise metadata (title, description, starter code)
- Receive user code submissions via `POST /api/exercises/run`
- Write user files to `tmp/submissions/<exercise_id>/`
- Trigger Docker sandbox container
- Return RSpec results to frontend

## Setup

```bash
bundle install
cp .env.example .env   # update credentials if needed
rails db:create db:migrate db:seed
rails server
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/exercises` | List all exercises |
| GET | `/api/exercises/:exercise_id` | Get single exercise |
| POST | `/api/exercises/run` | Run user code in Docker |

## Running Tests

```bash
bundle exec rspec
```

## Environment Variables

See `.env.example` for required variables.
