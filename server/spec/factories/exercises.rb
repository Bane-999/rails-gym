FactoryBot.define do
  factory :exercise do
    sequence(:exercise_id) { |n| "#{n.to_s.rjust(3, '0')}_exercise" }
    title        { Faker::Lorem.sentence(word_count: 4) }
    description  { Faker::Lorem.paragraph }
    difficulty   { "beginner" }
    category     { "validations" }
    starter_code do
      {
        "app/models/user.rb" => "class User < ApplicationRecord\nend"
      }
    end

    trait :beginner do
      difficulty { "beginner" }
    end

    trait :intermediate do
      difficulty { "intermediate" }
    end

    trait :advanced do
      difficulty { "advanced" }
    end

    trait :validation do
      category { "validations" }
    end

    trait :migration do
      category { "migrations" }
    end

    trait :association do
      category { "associations" }
    end

    trait :activerecord do
      category { "activerecord" }
    end

    trait :multi_file do
      starter_code do
        {
          "app/models/user.rb" => "class User < ApplicationRecord\nend",
          "app/models/post.rb" => "class Post < ApplicationRecord\nend"
        }
      end
    end

    factory :exercise_user_validation do
      exercise_id  { "001_user_validation" }
      title        { "Add Email Presence Validation" }
      difficulty   { "beginner" }
      category     { "validations" }
      description  { "Learn how to protect your database from bad data." }
      starter_code do
        {
          "app/models/user.rb" => "class User < ApplicationRecord\n  # Add your validation here\n\nend\n"
        }
      end
    end

    factory :exercise_add_email_column do
      exercise_id  { "002_add_email_column" }
      title        { "Add Email Column to Users Table" }
      difficulty   { "beginner" }
      category     { "migrations" }
      description  { "Practice writing a Rails migration." }
      starter_code do
        {
          "db/migrate/20240101000001_add_email_to_users.rb" =>
            "class AddEmailToUsers < ActiveRecord::Migration[7.1]\n  def change\n  end\nend\n"
        }
      end
    end

    factory :exercise_user_posts_association do
      exercise_id  { "003_user_posts_association" }
      title        { "User has_many Posts" }
      difficulty   { "intermediate" }
      category     { "associations" }
      description  { "Set up a one-to-many relationship between User and Post." }
      starter_code do
        {
          "app/models/user.rb" => "class User < ApplicationRecord\n  # Add your association here\n\nend\n",
          "app/models/post.rb" => "class Post < ApplicationRecord\n  # Add your association here\n\nend\n"
        }
      end
    end
  end
end
