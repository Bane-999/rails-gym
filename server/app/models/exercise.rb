class Exercise < ApplicationRecord
  validates :exercise_id,   presence: true, uniqueness: true
  validates :title,         presence: true
  validates :description,   presence: true
  validates :instructions,  presence: true
  validates :category,      presence: true
  validates :difficulty,    presence: true,
                            inclusion: {
                              in: %w[beginner intermediate advanced],
                              message: "%{value} is not valid. Use: beginner, intermediate, advanced"
                            }

  scope :by_category,   ->(cat)  { where(category: cat) }
  scope :by_difficulty, ->(diff) { where(difficulty: diff) }
  scope :ordered,       ->       { order(:exercise_id) }
end
