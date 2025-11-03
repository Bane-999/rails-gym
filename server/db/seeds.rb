puts "🌱 Seeding exercises..."

Exercise.destroy_all
puts "   Cleared existing exercises."

# ─── Exercise 1: User Email Validation ────────────────────────────────────────

Exercise.create!(
  exercise_id: "001_user_validation",
  title:       "Validate Presence of Email",
  difficulty:  "beginner",
  category:    "Validation",
  default_open_path: "app/models/user.rb",
  hint: "Use `validates :attribute, presence: true`.",

  description: <<~TEXT.strip,
    The User model requires an email address to be valid.
    Currently, users can be saved without an email, which causes
    issues in our mailer service.
  TEXT

  instructions: <<~MARKDOWN,
    ## Task: Add Validation

    The `User` model requires an email address to be valid.
    Currently, users can be saved without an email, which causes issues
    in our mailer service.

    ## Goal

    Add a Rails validation to ensure the `email` attribute is present.

    ## Example

```ruby
    user = User.new(email: nil)
    user.valid?           # => false
    user.errors[:email]   # => ["can't be blank"]
```

    ## Hints

    Use `validates :attribute, presence: true`
  MARKDOWN

  starter_code: {
    "app/models/user.rb" => <<~RUBY
      class User < ApplicationRecord
        # TODO: Add validation here

      end
    RUBY
  }
)

puts "   ✅ Created: 001_user_validation"

# ─── Exercise 2: Add Age Column Migration ─────────────────────────────────────

Exercise.create!(
  exercise_id: "002_add_age_to_users",
  title:       "Migration: Add Age Column",
  difficulty:  "beginner",
  category:    "Migration",
  default_open_path: "db/migrate/20240320120000_add_age_to_users.rb",
  hint: "Use `add_column :table_name, :column_name, :type`.",

  description: <<~TEXT.strip,
    We need to store the age of our users.
    Create a migration that adds an integer column named age to the users table.
  TEXT

  instructions: <<~MARKDOWN,
    ## Task: Create Migration

    We need to store the age of our users.
    Create a migration that adds an integer column named `age` to the `users` table.

    ## Goal

    Complete the `change` method in the migration file.

    ## Requirements

    - Table: `users`
    - Column: `age`
    - Type: `integer`

    ## Hints

    Use `add_column :table_name, :column_name, :type`
  MARKDOWN

  starter_code: {
    "db/migrate/20240320120000_add_age_to_users.rb" => <<~RUBY,
      class AddAgeToUsers < ActiveRecord::Migration[8.0]
        def change
          # TODO: Add column here

        end
      end
    RUBY
    "app/models/user.rb" => <<~RUBY
      class User < ApplicationRecord
      end
    RUBY
  }
)

puts "   ✅ Created: 002_add_age_to_users"

# ─── Exercise 3: ActiveRecord Find Admins ─────────────────────────────────────

Exercise.create!(
  exercise_id: "003_find_admins",
  title:       "ActiveRecord: Find Admins",
  difficulty:  "intermediate",
  category:    "ActiveRecord",
  default_open_path: "app/services/user_finder.rb",
  hint: "Use `User.where(condition)`.",

  description: <<~TEXT.strip,
    We need a way to find all users who are administrators.
    Implement a service object that queries the database for admin users.
  TEXT

  instructions: <<~MARKDOWN,
    ## Task: ActiveRecord Query

    We need a way to find all users who are administrators.
    Assume the `users` table has a boolean column `admin`.

    ## Goal

    Implement the `admins` class method in `UserFinder` to return
    all users where `admin` is `true`.

    ## Expected SQL

```sql
    SELECT * FROM users WHERE admin = TRUE
```

    ## Hints

    Use `User.where(condition)`
  MARKDOWN

  starter_code: {
    "app/services/user_finder.rb" => <<~RUBY,
      class UserFinder
        def self.admins
          # TODO: Return ActiveRecord relation for admins
          User.none
        end
      end
    RUBY
    "app/models/user.rb" => <<~RUBY
      class User < ApplicationRecord
      end
    RUBY
  }
)

puts "   ✅ Created: 003_find_admins"

# ─── Exercise 4: User has_many Posts ──────────────────────────────────────────

Exercise.create!(
  exercise_id: "004_user_posts_association",
  title:       "Associations: User has many Posts",
  difficulty:  "intermediate",
  category:    "Associations",
  default_open_path: "app/models/user.rb",
  hint: "Use `has_many` in User and `belongs_to` in Post.",

  description: <<~TEXT.strip,
    A user can have multiple posts, and a post belongs to a single user.
    Set up the correct Rails associations in both models.
  TEXT

  instructions: <<~MARKDOWN,
    ## Task: Define Associations

    We have `User` and `Post` models.
    A user can have multiple posts, and a post belongs to a single user.

    ## Goal

    1. Add `has_many :posts` to the User model
    2. Add `belongs_to :user` to the Post model

    You can switch between files using the file explorer on the left.

    ## Hints

    Use `has_many` in User and `belongs_to` in Post
  MARKDOWN

  starter_code: {
    "app/models/user.rb" => <<~RUBY,
      class User < ApplicationRecord
        # TODO: Add association to posts
      end
    RUBY
    "app/models/post.rb" => <<~RUBY
      class Post < ApplicationRecord
        # TODO: Add association to user
      end
    RUBY
  }
)

puts "   ✅ Created: 004_user_posts_association"

# ─── Summary ──────────────────────────────────────────────────────────────────

puts ""
puts "✅ Seeding complete!"
puts "   Total exercises: #{Exercise.count}"
puts ""
puts "   Exercises:"

Exercise.ordered.each do |ex|
  puts "   [#{ex.difficulty.upcase}] #{ex.exercise_id} — #{ex.title}"
end
