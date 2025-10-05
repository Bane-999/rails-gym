FactoryBot.define do
  factory :user do
    name   { Faker::Name.name }
    admin  { false }
    active { true }

    trait :admin do
      admin { true }
    end

    trait :inactive do
      active { false }
    end
  end
end
