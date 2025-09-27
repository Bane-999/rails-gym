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

  it "creates exactly 3 exercises" do
    expect(Exercise.count).to eq(3)
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
      expect(exercise.category).to eq("validations")
    end

    it "has a single starter code file" do
      expect(exercise.starter_code.keys.length).to eq(1)
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys).to include("app/models/user.rb")
    end

    it "has non-empty instructions" do
      expect(exercise.instructions).to be_present
    end
  end

  describe "002_add_email_column" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "002_add_email_column") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("beginner")
    end

    it "has correct category" do
      expect(exercise.category).to eq("migrations")
    end

    it "has the correct starter file path" do
      expect(exercise.starter_code.keys.first).to include("add_email_to_users")
    end

    it "has non-empty instructions" do
      expect(exercise.instructions).to be_present
    end
  end

  describe "003_user_posts_association" do
    subject(:exercise) { Exercise.find_by!(exercise_id: "003_user_posts_association") }

    it "exists" do
      expect(exercise).to be_present
    end

    it "has correct difficulty" do
      expect(exercise.difficulty).to eq("intermediate")
    end

    it "has correct category" do
      expect(exercise.category).to eq("associations")
    end

    it "has two starter code files" do
      expect(exercise.starter_code.keys.length).to eq(2)
    end

    it "has user.rb and post.rb starter files" do
      expect(exercise.starter_code.keys).to include(
        "app/models/user.rb",
        "app/models/post.rb"
      )
    end

    it "has non-empty instructions" do
      expect(exercise.instructions).to be_present
    end
  end

  describe "seeds are idempotent" do
    it "is idempotent" do
      original_stdout = $stdout
      $stdout = StringIO.new

      2.times { load Rails.root.join("db/seeds.rb") }

      $stdout = original_stdout

      expect(Exercise.count).to eq(3)
    end
  end
end
