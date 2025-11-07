class CreateExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :exercises do |t|
      t.string :exercise_id,  null: false
      t.string :title,        null: false
      t.text :description,    null: false
      t.string :difficulty,   null: false
      t.string :category,     null: false
      t.jsonb :starter_code,  null: false, default: {}

      t.timestamps
    end

    add_index :exercises, :exercise_id, unique: true
    add_index :exercises, :category
    add_index :exercises, :difficulty
  end
end
