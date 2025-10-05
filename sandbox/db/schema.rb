# sandbox/db/schema.rb
#
# Base database state for the Rails Gym sandbox.
#
# Rules:
#   - Only contains tables required by CURRENT exercises
#   - New exercises bring their own schema changes
#   - Intentionally minimal — exercises add to it, not the other way around
#
# Current exercises and what they need:
#   001_user_validation        → users table
#   002_add_age_to_users       → users table WITHOUT age (exercise adds it)
#   003_find_admins            → users table WITH admin column
#   004_user_posts_association → users + posts tables

ActiveRecord::Schema[8.0].define(version: 2024_01_01_000000) do

  # ─── Users ──────────────────────────────────────────────────────────────────
  #
  # Shared by all 4 exercises.
  #
  # Intentionally MISSING:
  #   - email  → 001 tests presence validation without it in schema
  #   - age    → 002 exercise adds it via migration
  #
  # Intentionally PRESENT:
  #   - admin  → 003 needs it to query WHERE admin = true
  #   - name   → useful for factory data in all exercises
  create_table :users, force: :cascade do |t|
    t.string  :name,    null: false, default: ""
    t.string :email
    t.boolean :admin,   null: false, default: false
    t.boolean :active,  null: false, default: true
    t.timestamps
  end

  # ─── Posts ──────────────────────────────────────────────────────────────────
  #
  # Used by 004_user_posts_association.
  # Has user_id so belongs_to :user works once the user adds the association.
  create_table :posts, force: :cascade do |t|
    t.string  :title,     null: false, default: ""
    t.text    :body
    t.boolean :published, null: false, default: false
    t.integer :user_id
    t.timestamps

    t.index [:user_id], name: "index_posts_on_user_id"
  end

end
