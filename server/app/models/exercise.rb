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

  # Generate fileTree from starter_code keys (file paths)
  def file_tree
    return [] if starter_code.blank?

    files = starter_code.keys
    build_tree(files)
  end

  private

  def build_tree(paths)
    tree = {}

    paths.each do |path|
      parts = path.split("/")
      current = tree

      parts.each_with_index do |part, index|
        is_file = (index == parts.length - 1)

        if is_file
          current[part] = { name: part, isFolder: false }
        else
          current[part] ||= { name: part, isFolder: true, children: {} }
          current = current[part][:children]
        end
      end
    end

    tree_to_array(tree)
  end

  def tree_to_array(hash)
    hash.map do |key, node|
      if node[:isFolder]
        {
          name: node[:name],
          isFolder: true,
          children: tree_to_array(node[:children] || {})
        }
      else
        { name: node[:name], isFolder: false }
      end
    end
  end
end
