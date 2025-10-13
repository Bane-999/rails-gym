#!/usr/bin/env bash
# sandbox/docker-entrypoint.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

APP_ROOT="${APP_ROOT:-/app}"
USER_CODE_DIR="${USER_CODE_DIR:-$APP_ROOT/user_code}"

mkdir -p "$APP_ROOT/logs"

echo ""
echo "🏋️  Rails Gym Sandbox"
echo "────────────────────────"

# ─── Validate inputs ──────────────────────────────────────────────────────────

if [ -z "${EXERCISE_ID:-}" ]; then
  echo -e "${RED}❌ Missing EXERCISE_ID${NC}"
  exit 2
fi

SPEC_FILE="$APP_ROOT/spec/exercises/${EXERCISE_ID}_spec.rb"

if [ ! -f "$SPEC_FILE" ]; then
  echo -e "${RED}❌ Spec not found: $SPEC_FILE${NC}"
  echo "   Available specs:"
  ls "$APP_ROOT/spec/exercises/"
  exit 2
fi

if [ ! -d "$USER_CODE_DIR" ]; then
  echo -e "${RED}❌ Missing user code dir: $USER_CODE_DIR${NC}"
  exit 2
fi

echo "📋 Exercise: $EXERCISE_ID"
echo ""

# ─── Copy user files ──────────────────────────────────────────────────────────

copy_if_exists() {
  local source_dir="$USER_CODE_DIR/$1"
  local target_dir="$APP_ROOT/$1"

  # silently skip if source doesn't exist
  [ ! -d "$source_dir" ] && return 0

  # process substitution avoids subshell pipe issues with pipefail
  while IFS= read -r file; do
    local rel="${file#$source_dir/}"
    mkdir -p "$target_dir/$(dirname "$rel")"
    cp "$file" "$target_dir/$rel"
    echo "   ✅ $1/$rel"
  done < <(find "$source_dir" -type f)
}

echo "📦 Copying user code..."
copy_if_exists "app/models"
copy_if_exists "app/controllers"
copy_if_exists "app/services"
copy_if_exists "db/migrate"
echo ""

cd "$APP_ROOT"

# ─── Suppress Ruby/gem warnings from RSpec output ─────────────────────────────

export RUBYOPT="-W:no-experimental -W:no-deprecated"

WARN_LOG="$APP_ROOT/logs/warnings.log"
: > "$WARN_LOG"

# ─── Load schema ──────────────────────────────────────────────────────────────

echo "🗄️  Loading database..."
bundle exec rails db:schema:load --quiet 2>>"$WARN_LOG" || true
echo "   ✅ DB ready"
echo ""

# ─── Run specs ────────────────────────────────────────────────────────────────

echo "🧪 Running tests..."
echo "────────────────────────"
echo ""

set +e
bundle exec rspec "$SPEC_FILE" \
  --format progress \
  --no-color \
  2>>"$WARN_LOG"
RSPEC_EXIT=$?
set -e

echo ""
echo "────────────────────────"

if [ "$RSPEC_EXIT" -eq 0 ]; then
  echo -e "${GREEN}✅ All specs passed${NC}"
else
  echo -e "${RED}❌ Tests failed${NC}"
fi

echo ""

exit "$RSPEC_EXIT"
