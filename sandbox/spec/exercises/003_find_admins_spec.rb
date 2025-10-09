# sandbox/spec/exercises/003_find_admins_spec.rb
#
# Exercise: ActiveRecord — Find Admins
# Category: ActiveRecord
# Difficulty: Medium
#
# What the user must do:
#   Implement UserFinder.admins to return User.where(admin: true)
#
# These specs are HIDDEN from the user.

require "rails_helper"

# Load the user's submitted service file
require Rails.root.join("app/services/user_finder")

RSpec.describe UserFinder, type: :model do

  # Clean up users between specs — factories handle creation
  before(:each) { User.delete_all }

  describe ".admins" do

    context "when no users exist" do
      it "returns an empty collection" do
        expect(UserFinder.admins).to be_empty
      end
    end

    context "when only non-admin users exist" do
      before do
        create(:user, admin: false)
        create(:user, admin: false)
      end

      it "returns an empty collection" do
        expect(UserFinder.admins).to be_empty
      end
    end

    context "when only admin users exist" do
      before do
        create(:user, :admin)
        create(:user, :admin)
      end

      it "returns all users" do
        expect(UserFinder.admins.count).to eq(2)
      end

      it "returns users where admin is true" do
        UserFinder.admins.each do |user|
          expect(user.admin).to be true
        end
      end
    end

    context "when both admin and non-admin users exist" do
      let!(:admin_user)     { create(:user, :admin, name: "Alice") }
      let!(:regular_user)   { create(:user, admin: false, name: "Bob") }

      it "returns only admin users" do
        expect(UserFinder.admins.count).to eq(1)
      end

      it "includes the admin user" do
        expect(UserFinder.admins).to include(admin_user)
      end

      it "excludes the non-admin user" do
        expect(UserFinder.admins).not_to include(regular_user)
      end
    end

    context "return value" do
      it "returns an ActiveRecord::Relation (not an array)" do
        expect(UserFinder.admins).to be_a(ActiveRecord::Relation)
      end

      it "responds to ActiveRecord query methods" do
        expect(UserFinder.admins).to respond_to(:where)
        expect(UserFinder.admins).to respond_to(:count)
        expect(UserFinder.admins).to respond_to(:first)
      end
    end
  end
end
