require "rails_helper"

RSpec.describe "002 Add Age To Users Migration", type: :migration do

  let(:migration_file) do
    Rails.root.join("db/migrate/20240320120000_add_age_to_users.rb")
  end

  # Load and run the migration fresh before each spec.
  # reset_schema! ensures we always start from the base schema
  before(:each) do
    reset_schema!

    unless File.exist?(migration_file)
      raise "Migration file not found: #{migration_file}"
    end

    load migration_file

    ActiveRecord::Migration.suppress_messages do
      AddAgeToUsers.new.change
    end

    ActiveRecord::Base.connection.schema_cache.clear!
    User.reset_column_information
  end

  describe "the migration" do

    it "adds the age column to the users table" do
      expect(column_exists?(:users, :age)).to be true
    end

    it "creates age as an integer column" do
      expect(column_type(:users, :age)).to eq(:integer)
    end

    it "allows age to be saved on a user record" do
      user = User.create!(name: "Alice", age: 30)
      expect(user.age).to eq(30)
    end

    it "allows age to be nil (no presence constraint required)" do
      user = User.create!(name: "Bob", age: nil)
      expect(user.age).to be_nil
    end

    it "does not affect existing columns" do
      expect(column_exists?(:users, :name)).to be true
      expect(column_exists?(:users, :admin)).to be true
    end

  end

end
