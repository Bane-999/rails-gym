# sandbox/spec/support/database_helpers.rb
#
# Small helper methods available to all exercise specs.

module DatabaseHelpers

  # Check if a column exists on a table.
  # Used by migration exercises to verify the column was added.
  #
  # Example:
  #   expect(column_exists?(:users, :age)).to be true
  def column_exists?(table, column)
    ActiveRecord::Base.connection.column_exists?(table, column)
  end

  # Check what type a column is.
  # Used by migration exercises to verify column type.
  #
  # Example:
  #   expect(column_type(:users, :age)).to eq(:integer)
  def column_type(table, column)
    ActiveRecord::Base.connection.columns(table)
                      .find { |c| c.name.to_s == column.to_s }
                      &.type
  end

  # Reset the database to the base schema state.
  # Used by migration exercises to run a clean migration.
  def reset_schema!
    ActiveRecord::Schema.verbose = false
    load Rails.root.join("db/schema.rb")
  end

end

RSpec.configure do |config|
  config.include DatabaseHelpers
end
