# Rails Gym — Sandbox

The isolated Docker environment that runs user-submitted code safely.

---

## What is this?

The sandbox is a minimal Rails project that lives inside Docker.
It receives user code, runs hidden RSpec tests against it, and returns results.

**Users never see this code.** They only see:
- The exercise description
- Their starter code in the editor
- The RSpec output (pass/fail)

---

## How it works

Backend mounts user code      →  /app/user_code/
Entrypoint copies files       →  /app/app/models/user.rb
Schema loads fresh            →  SQLite test database
RSpec runs hidden spec        →  spec/exercises/001_..._spec.rb
Output returned to backend    →  stdout captured by Open3

---

## Build the image

```bash
docker build -t rails-gym-sandbox .
```

---

## Run manually

```bash
# Create a test submission
mkdir -p /tmp/submission/app/models
cat > /tmp/submission/app/models/user.rb << 'EOF'
class User < ApplicationRecord
  validates :email, presence: true
end
EOF

# Run the container
docker run --rm \
  -v /tmp/submission:/app/user_code \
  -e EXERCISE_ID=001_user_validation \
  rails-gym-sandbox
```

---

## Adding a new exercise

1. Add spec to `spec/exercises/NNN_exercise_name_spec.rb`
2. Add any new tables to `db/schema.rb`
3. Add any new base models to `app/models/`
4. Rebuild the Docker image: `docker build -t rails-gym-sandbox .`
5. Add exercise metadata to `backend/db/seeds.rb`
6. Run `rails db:seed` in the backend

---

## Directory structure

sandbox/
├── app/
│   ├── models/          ← base models (replaced by user code at runtime)
│   └── services/        ← base services (replaced by user code at runtime)
├── db/
│   ├── schema.rb        ← base database state
│   └── migrate/         ← user migrations copied here at runtime
├── spec/
│   ├── exercises/       ← hidden RSpec tests (one per exercise)
│   ├── factories/       ← FactoryBot factories
│   └── support/         ← helper modules
├── Dockerfile
├── docker-entrypoint.sh
└── Gemfile

---

## Security

- `--network none` → no internet access inside container
- `--memory 256m` → RAM limited
- `--cpus 0.5` → CPU limited
- Container removed after each run (`--rm`)
- User code never persists between runs
