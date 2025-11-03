class Api::ExercisesController < ApplicationController
  def index
    exercises = Exercise.ordered

    render json: format_exercises(exercises), status: :ok
  end

  def show
    exercise = Exercise.find_by!(exercise_id: params[:exercise_id])

    render json: format_exercise(exercise), status: :ok

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

    unless Exercise.exists?(exercise_id: exercise_id)
      return render json: {
        success: false,
        error:   "Exercise '#{exercise_id}' not found."
      }, status: :not_found
    end

    files_hash = files.to_unsafe_h

    result = CodeRunnerService.new(exercise_id, files_hash).run

    render json: result, status: :ok
  end

  private

  def format_exercises(exercises)
    exercises.map { |exercise| format_exercise(exercise) }
  end

  def format_exercise(exercise)
    {
      id: "ex_#{exercise.id}",
      exercise_id: exercise.exercise_id,
      title: exercise.title,
      category: exercise.category,
      difficulty: exercise.difficulty,
      description: exercise.description,
      defaultOpenPath: exercise.default_open_path,
      files: exercise.starter_code,
      fileTree: exercise.file_tree,
      hint: exercise.hint
    }
  end
end
