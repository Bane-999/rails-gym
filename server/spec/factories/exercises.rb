FactoryBot.define do
  factory :exercise do
    sequence(:exercise_id) { |n| "#{n.to_s.rjust(3, '0')}_exercise" }
    title        { Faker::Lorem.sentence(word_count: 4) }
    description  { Faker::Lorem.paragraph }
    instructions { Faker::Lorem.paragraphs(number: 3).join("\n\n") }
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
  end
end
