FactoryBot.define do
  factory :post do
    title     { Faker::Lorem.sentence(word_count: 4) }
    body      { Faker::Lorem.paragraph }
    published { false }

    # user_id left nil by default —
    # association exercises set it explicitly
    trait :published do
      published { true }
    end

    trait :with_user do
      association :user
    end
  end
end
