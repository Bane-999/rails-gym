# Rails Gym Sandbox — isolated code execution environment
#
# This image:
#   1. Installs Ruby + system dependencies
#   2. Installs all gems via bundler
#   3. Copies the sandbox Rails project
#   4. Pre-loads the database schema
#   5. Runs docker-entrypoint.sh on every container start
#
# Build:
#   docker build -t rails-gym-sandbox .
#
# Run (manually):
#   docker run --rm \
#     -v /path/to/user/code:/app/user_code \
#     -e EXERCISE_ID=001_user_validation \
#     rails-gym-sandbox

# ─── Base image ───────────────────────────────────────────────────────────────
# ruby:3.2.2-slim is a minimal Debian image with Ruby pre-installed.
# We use slim (not alpine) because:
#   - alpine has musl libc which causes issues with some native gems
#   - slim is still small but uses standard glibc
FROM ruby:3.2.2-slim

# ─── System dependencies ──────────────────────────────────────────────────────
# We need:
#   build-essential → compiling native gem extensions (nokogiri etc.)
#   libsqlite3-dev  → sqlite3 gem needs this header
#   sqlite3         → the actual SQLite binary
#   curl            → useful for healthchecks (optional but handy)
#   git             → some gems require it at install time
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libsqlite3-dev \
      sqlite3 \
      curl \
      git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ─── Working directory ────────────────────────────────────────────────────────
WORKDIR /app

# ─── Install gems ─────────────────────────────────────────────────────────────
# Copy Gemfile first — Docker caches this layer.
# If Gemfile hasn't changed, bundle install is skipped on rebuild.
# This is the most important Docker caching trick.
COPY Gemfile Gemfile.lock ./

RUN bundle config set --local without "" && \
    bundle config set --local deployment false && \
    bundle install --jobs 4 --retry 3

# ─── Copy application code ────────────────────────────────────────────────────
COPY . .

# ─── Permissions ──────────────────────────────────────────────────────────────
RUN chmod +x /app/docker-entrypoint.sh

# ─── Pre-load database schema ─────────────────────────────────────────────────
RUN RAILS_ENV=test bundle exec rails db:schema:load

# ─── Create runtime directories ───────────────────────────────────────────────
RUN mkdir -p /app/user_code /app/logs

# ─── Environment ──────────────────────────────────────────────────────────────
ENV RAILS_ENV=test
ENV APP_ROOT=/app

# ─── Entrypoint ───────────────────────────────────────────────────────────────
ENTRYPOINT ["/app/docker-entrypoint.sh"]
