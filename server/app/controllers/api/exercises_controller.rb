class Api::ExercisesController < ApplicationController
  def index
    exercises = Exercise.ordered.select(
      :id,
      :exercise_id,
      :title,
      :description,
      :difficulty,
      :category
    )

    render json: exercises, status: :ok
  end

  def show
    exercise = Exercise.find_by!(exercise_id: params[:exercise_id])

    render json: exercise, status: :ok

  rescue ActiveRecord::RecordNotFound
    render json: {
      error: "Exercise '#{params[:exercise_id]}' not found."
    }, status: :not_found
  end

  # Expected request body:
  #   {
  #     "exercise_id": "001_user_validation",
  #     "files": {
  #       "app/models/user.rb": "class User < ApplicationRecord\n..."
  #     }
  #   }
  #
  # Returns:
  #   {
  #     "success": true | false,
  #     "output":  "RSpec output...",
  #     "message": "All tests passed!..."
  #   }
  def run
    exercise_id = params[:exercise_id]
    files       = params[:files]

    if exercise_id.blank?
      return render json: {
        success: false,
        error:   "Missing required parameter: exercise_id"
      }, status: :bad_request
    end

    if files.blank?
      return render json: {
        success: false,
        error:   "Missing required parameter: files"
      }, status: :bad_request
    end

    unless files.is_a?(ActionController::Parameters) || files.is_a?(Hash)
      return render json: {
        success: false,
        error:   "Parameter 'files' must be an object (key: path, value: code)"
      }, status: :bad_request
    end

    files_hash = files.to_unsafe_h

    unless Exercise.exists?(exercise_id: exercise_id)
      return render json: {
        success: false,
        error:   "Exercise '#{exercise_id}' not found."
      }, status: :not_found
    end

    result = CodeRunnerService.new(exercise_id, files_hash).run

    render json: result, status: :ok
  end
end
