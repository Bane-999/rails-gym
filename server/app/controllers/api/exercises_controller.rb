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
end
