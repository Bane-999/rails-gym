require "rails_helper"

RSpec.describe Exercise, type: :model do
  describe "validations" do
    describe "exercise_id" do
      it { should validate_presence_of(:exercise_id) }

      it "is invalid when duplicate" do
        create(:exercise, exercise_id: "001_duplicate")
        duplicate = build(:exercise, exercise_id: "001_duplicate")
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:exercise_id]).to include("has already been taken")
      end
    end

    describe "title" do
      it { should validate_presence_of(:title) }
    end

    describe "description" do
      it { should validate_presence_of(:description) }
    end

    describe "instructions" do
      it { should validate_presence_of(:instructions) }
    end

    describe "category" do
      it { should validate_presence_of(:category) }
    end

    describe "difficulty" do
      it { should validate_presence_of(:difficulty) }

      it "accepts beginner" do
        expect(build(:exercise, difficulty: "beginner")).to be_valid
      end

      it "accepts intermediate" do
        expect(build(:exercise, difficulty: "intermediate")).to be_valid
      end

      it "accepts advanced" do
        expect(build(:exercise, difficulty: "advanced")).to be_valid
      end

      it "rejects invalid difficulty" do
        exercise = build(:exercise, difficulty: "super_hard")
        expect(exercise).not_to be_valid
        expect(exercise.errors[:difficulty]).to include(
          "super_hard is not valid. Use: beginner, intermediate, advanced"
        )
      end
    end
  end

  describe "scopes" do
    before do
      create(:exercise, :beginner,     :validation,  exercise_id: "001_a")
      create(:exercise, :intermediate, :migration,   exercise_id: "002_b")
      create(:exercise, :advanced,     :association, exercise_id: "003_c")
    end

    describe ".by_category" do
      it "returns only exercises matching the category" do
        result = Exercise.by_category("validations")
        expect(result.count).to eq(1)
        expect(result.first.category).to eq("validations")
      end

      it "returns empty when no match" do
        expect(Exercise.by_category("nonexistent")).to be_empty
      end
    end

    describe ".by_difficulty" do
      it "returns only exercises matching the difficulty" do
        result = Exercise.by_difficulty("beginner")
        expect(result.count).to eq(1)
        expect(result.first.difficulty).to eq("beginner")
      end

      it "returns empty when no match" do
        expect(Exercise.by_difficulty("nonexistent")).to be_empty
      end
    end

    describe ".ordered" do
      it "returns exercises ordered by exercise_id" do
        ids = Exercise.ordered.map(&:exercise_id)
        expect(ids).to eq(ids.sort)
      end
    end
  end

  describe "database" do
    it "stores and retrieves starter_code as jsonb" do
      code = { "app/models/user.rb" => "class User < ApplicationRecord\nend" }
      exercise = create(:exercise, starter_code: code)
      exercise.reload
      expect(exercise.starter_code).to eq(code)
    end

    it "stores multiple files in starter_code" do
      exercise = create(:exercise, :multi_file)
      exercise.reload
      expect(exercise.starter_code.keys).to contain_exactly(
        "app/models/user.rb",
        "app/models/post.rb"
      )
    end
  end
end
