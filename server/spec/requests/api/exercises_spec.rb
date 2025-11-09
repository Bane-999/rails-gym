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
        expect(exercise.keys).not_to include("starter_code")
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

      it "returns full exercise fields including starter_code" do
        get "/api/exercises/001_user_validation"
        body = JSON.parse(response.body)

        expect(body.keys).to include(
          "id",
          "exercise_id",
          "title",
          "description",
          "difficulty",
          "category",
          "files"
        )
      end

      it "returns files as a hash" do
        get "/api/exercises/001_user_validation"
        body = JSON.parse(response.body)
        expect(body["files"]).to be_a(Hash)
        expect(body["files"].keys).to include("app/models/user.rb")
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

  describe "POST /api/exercises/run" do
    let!(:exercise) { create(:exercise, exercise_id: "001_user_validation") }

    let(:valid_files) do
      {
        "app/models/user.rb" =>
          "class User < ApplicationRecord\n  validates :email, presence: true\nend"
      }
    end

    let(:passing_output) { "1 example, 0 failures" }
    let(:failing_output) { "1 example, 1 failure\n\nFailures:\n\n  1) User..." }

    before do
      allow(Open3).to receive(:capture2e).and_return([
        passing_output,
        double(exitstatus: 0)
      ])
    end

    context "with valid params" do
      it "returns HTTP 200" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        expect(response).to have_http_status(:ok)
      end

      it "returns success: true when tests pass" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["success"]).to be true
      end

      it "returns RSpec output" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["output"]).to include("0 failures")
      end

      it "returns a human-readable message" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["message"]).to be_present
      end
    end

    context "when tests fail" do
      before do
        allow(Open3).to receive(:capture2e).and_return([
          failing_output,
          double(exitstatus: 1)
        ])
      end

      it "still returns HTTP 200 (it ran successfully, tests just failed)" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        expect(response).to have_http_status(:ok)
      end

      it "returns success: false" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["success"]).to be false
      end

      it "returns failure output" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["output"]).to include("1 failure")
      end
    end

    context "when exercise_id is missing" do
      it "returns HTTP 400" do
        post "/api/exercises/run", params: {
          files: valid_files
        }, as: :json

        expect(response).to have_http_status(:bad_request)
      end

      it "returns a clear error message" do
        post "/api/exercises/run", params: {
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["error"]).to include("exercise_id")
      end
    end

    context "when files param is missing" do
      it "returns HTTP 400" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation"
        }, as: :json

        expect(response).to have_http_status(:bad_request)
      end

      it "returns a clear error message" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation"
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["error"]).to include("files")
      end
    end

    context "when files param is wrong type" do
      it "returns HTTP 400" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: ["wrong", "format"]
        }, as: :json

        expect(response).to have_http_status(:bad_request)
      end

      it "returns a clear error message" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: ["wrong", "format"]
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["error"]).to include("object")
      end
    end

    context "when exercise does not exist" do
      it "returns HTTP 404" do
        post "/api/exercises/run", params: {
          exercise_id: "999_fake",
          files: valid_files
        }, as: :json

        expect(response).to have_http_status(:not_found)
      end

      it "returns a clear error message" do
        post "/api/exercises/run", params: {
          exercise_id: "999_fake",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["error"]).to include("999_fake")
      end
    end

    context "when Docker crashes unexpectedly" do
      before do
        allow(Open3).to receive(:capture2e).and_raise(
          Errno::ENOENT, "docker: command not found"
        )
      end

      it "returns HTTP 200 (error handled gracefully)" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        expect(response).to have_http_status(:ok)
      end

      it "returns success: false" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["success"]).to be false
      end

      it "returns a human-friendly message" do
        post "/api/exercises/run", params: {
          exercise_id: "001_user_validation",
          files: valid_files
        }, as: :json

        body = JSON.parse(response.body)
        expect(body["message"]).to include("Something went wrong")
      end
    end
  end
end
