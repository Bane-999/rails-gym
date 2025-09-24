# db/seeds.rb
#
# Seeds the database with initial exercises for Rails Gym.
#
# Run with:
#   rails db:seed
#
# Reset and re-seed with:
#   rails db:seed:replant   (Rails 6+)
#   OR
#   rails db:drop db:create db:migrate db:seed

puts "🌱 Seeding exercises..."

# ─── Clear existing exercises ──────────────────────────────────────────────────
# Safe to destroy all in development — exercises come from seeds, not user data.
Exercise.destroy_all
puts "   Cleared existing exercises."

# ─── Exercise 1: User Email Validation ────────────────────────────────────────

Exercise.create!(
  exercise_id: "001_user_validation",
  title:       "Add Email Presence Validation",
  difficulty:  "beginner",
  category:    "validations",

  description: <<~TEXT.strip,
    Learn how to protect your database from bad data by adding
    your first ActiveRecord validation to the User model.
  TEXT

  instructions: <<~MARKDOWN,
    ## Your Task

    The `User` model is missing a validation.
    Right now, a user can be saved without an email address — that's a problem!

    Add a **presence validation** for the `email` attribute so that
    a user without an email is considered invalid.

    ## Requirements

    - A `User` with no email must be **invalid**
    - `user.errors[:email]` must include `"can't be blank"`
    - A `User` with an email must be **valid**

    ## Syntax Reminder

```ruby
    validates :attribute_name, presence: true
```

    ## Example

```ruby
    user = User.new(email: nil)
    user.valid?           # => false
    user.errors[:email]   # => ["can't be blank"]

    user = User.new(email: "jo@example.com")
    user.valid?           # => true
```
  MARKDOWN

  starter_code: {
    "app/models/user.rb" => <<~RUBY
      class User < ApplicationRecord
        # Add your validation here

      end
    RUBY
  }
)

puts "   ✅ Created: 001_user_validation"

# ─── Exercise 2: Add Email Column Migration ────────────────────────────────────

Exercise.create!(
  exercise_id: "002_add_email_column",
  title:       "Add Email Column to Users Table",
  difficulty:  "beginner",
  category:    "migrations",

  description: <<~TEXT.strip,
    Practice writing a Rails migration to add a new column
    to an existing database table.
  TEXT

  instructions: <<~MARKDOWN,
    ## Your Task

    The `users` table exists but it's missing an `email` column.
    Write a migration that adds it.

    ## Requirements

    - Add an `email` column to the `users` table
    - Column type must be `string`
    - Column must NOT allow null values (`null: false`)
    - Column must default to an empty string (`default: ""`)

    ## Syntax Reminder

```ruby
    def change
      add_column :table_name, :column_name, :type, options
    end
```

    ## Options you'll need

```ruby
    null: false, default: ""
```

    ## Example

```ruby
    add_column :products, :sku, :string, null: false, default: ""
```
  MARKDOWN

  starter_code: {
    "db/migrate/20240101000001_add_email_to_users.rb" => <<~RUBY
      class AddEmailToUsers < ActiveRecord::Migration[7.1]
        def change
          # Write your migration here

        end
      end
    RUBY
  }
)

puts "   ✅ Created: 002_add_email_column"

# ─── Exercise 3: User has_many Posts Association ───────────────────────────────

Exercise.create!(
  exercise_id: "003_user_posts_association",
  title:       "User has_many Posts",
  difficulty:  "intermediate",
  category:    "associations",

  description: <<~TEXT.strip,
    Set up a one-to-many relationship between User and Post
    so that each user can own multiple posts.
  TEXT

  instructions: <<~MARKDOWN,
    ## Your Task

    Set up an **association** between the `User` and `Post` models.

    A user can write many posts. A post belongs to one user.
    This is a classic **one-to-many** relationship in Rails.

    ## Requirements

    - `User` model must declare `has_many :posts`
    - `Post` model must declare `belongs_to :user`
    - Both declarations must use standard Rails association syntax

    ## Syntax Reminder

```ruby
    # On the "one" side (User)
    has_many :posts

    # On the "many" side (Post)
    belongs_to :user
```

    ## What this gives you

```ruby
    user = User.find(1)
    user.posts           # => all posts belonging to this user
    user.posts.count     # => number of posts

    post = Post.find(1)
    post.user            # => the user who owns this post
```
  MARKDOWN

  starter_code: {
    "app/models/user.rb" => <<~RUBY,
      class User < ApplicationRecord
        # Add your association here

      end
    RUBY
    "app/models/post.rb" => <<~RUBY
      class Post < ApplicationRecord
        # Add your association here

      end
    RUBY
  }
)

puts "   ✅ Created: 003_user_posts_association"

# ─── Summary ──────────────────────────────────────────────────────────────────

puts ""
puts "✅ Seeding complete!"
puts "   Total exercises: #{Exercise.count}"
puts ""
puts "   Exercises:"
Exercise.ordered.each do |ex|
  puts "   [#{ex.difficulty.upcase}] #{ex.exercise_id} — #{ex.title}"
end
