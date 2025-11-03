class AddMetadataToExercises < ActiveRecord::Migration[8.0]
  def change
    add_column :exercises, :default_open_path, :string, null: false, default: ""
    add_column :exercises, :hint, :text, null: false, default: ""
  end
end
