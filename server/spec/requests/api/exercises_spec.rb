require "rails_helper"

RSpec.describe "Api::Exercises", type: :request do

  describe "GET /api/exercises" do
    context "when there are no exercises" do
      it "returns an empty array" do
        get "/api/exercises"
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq([])
      end
    end

    context "when exercises exist" do
      before do
        create(:exercise, exercise_id: "001_a", title: "First")
        create(:exercise, exercise_id: "002_b", title: "Second")
        create(:exercise, exercise_id: "003_c", title: "Third")
      end

      it "returns HTTP 200" do
        get "/api/exercises"
        expect(response).to have_http_status(:ok)
      end

      it "returns all exercises" do
        get "/api/exercises"
        body = JSON.parse(response.body)
        expect(body.length).to eq(3)
      end

      it "returns exercises ordered by exercise_id" do
        get "/api/exercises"
        ids = JSON.parse(response.body).map { |e| e["exercise_id"] }
        expect(ids).to eq(%w[001_a 002_b 003_c])
      end

      it "returns lightweight fields only" do
        get "/api/exercises"
        exercise = JSON.parse(response.body).first

        # These fields SHOULD be present in list view
        expect(exercise.keys).to include(
          "id", "exercise_id", "title", "description", "difficulty", "category"
        )

        # These fields should NOT be present in list view (too heavy)
        expect(exercise.keys).not_to include("starter_code", "instructions")
      end

      it "returns JSON content type" do
        get "/api/exercises"
        expect(response.content_type).to match(%r{application/json})
      end
    end
  end

  describe "GET /api/exercises/:exercise_id" do
    context "when the exercise exists" do
      let!(:exercise) do
        create(:exercise,
          exercise_id:  "001_user_validation",
          title:        "Add Email Validation",
          difficulty:   "beginner",
          category:     "validations",
          starter_code: { "app/models/user.rb" => "class User < ApplicationRecord\nend" }
        )
      end

      it "returns HTTP 200" do
        get "/api/exercises/001_user_validation"
        expect(response).to have_http_status(:ok)
      end

      it "returns the correct exercise" do
        get "/api/exercises/001_user_validation"
        body = JSON.parse(response.body)
        expect(body["exercise_id"]).to eq("001_user_validation")
        expect(body["title"]).to eq("Add Email Validation")
      end

      it "returns full exercise fields including starter_code and instructions" do
        get "/api/exercises/001_user_validation"
        body = JSON.parse(response.body)

        expect(body.keys).to include(
          "id",
          "exercise_id",
          "title",
          "description",
          "difficulty",
          "category",
          "instructions",
          "starter_code"
        )
      end

      it "returns starter_code as a hash" do
        get "/api/exercises/001_user_validation"
        body = JSON.parse(response.body)
        expect(body["starter_code"]).to be_a(Hash)
        expect(body["starter_code"].keys).to include("app/models/user.rb")
      end

      it "returns JSON content type" do
        get "/api/exercises/001_user_validation"
        expect(response.content_type).to match(%r{application/json})
      end
    end

    context "when the exercise does not exist" do
      it "returns HTTP 404" do
        get "/api/exercises/not_a_real_exercise"
        expect(response).to have_http_status(:not_found)
      end

      it "returns an error message" do
        get "/api/exercises/not_a_real_exercise"
        body = JSON.parse(response.body)
        expect(body["error"]).to include("not_a_real_exercise")
      end
    end
  end

end
