require "rails_helper"

RSpec.describe "Database Seeds", type: :task do
  before(:all) do
    $stdout = StringIO.new
    load Rails.root.join("db/seeds.rb")
    $stdout = STDOUT
  end

  after(:all) do
    Exercise.delete_all
  end

  it "creates exactly 4 exercises" do
    expect(Exercise.count).to eq(4)
  end

  it "creates all exercises with valid data" do
    Exercise.all.each do |exercise|
      expect(exercise).to be_valid,
        "Exercise #{exercise.exercise_id} is invalid: #{exercise.errors.full_messages}"
    end
  end

  describe "001_user_validation" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "001_user_validation") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("beginner")
    end

    it "has correct category" do
      expect(exercise.category).to eq("Validation")
    end

    it "has a single starter code file" do
      expect(exercise.starter_code.keys.length).to eq(1)
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys).to include("app/models/user.rb")
    end
  end

  describe "002_add_age_to_users" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "002_add_age_to_users") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("beginner")
    end

    it "has correct category" do
      expect(exercise.category).to eq("Migration")
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys.first).to include("add_age_to_users")
    end
  end

  describe "003_find_admins" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "003_find_admins") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("intermediate")
    end

    it "has correct category" do
      expect(exercise.category).to eq("ActiveRecord")
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys).to include("app/services/user_finder.rb")
    end
  end

  describe "004_user_posts_association" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "004_user_posts_association") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("intermediate")
    end

    it "has correct category" do
      expect(exercise.category).to eq("Associations")
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys).to include("app/models/post.rb", "app/models/user.rb")
    end
  end

  describe "seeds are idempotent" do
    it "is idempotent" do
      original_stdout = $stdout
      $stdout = StringIO.new

      2.times { load Rails.root.join("db/seeds.rb") }

      $stdout = original_stdout

      expect(Exercise.count).to eq(4)
    end
  end
end
