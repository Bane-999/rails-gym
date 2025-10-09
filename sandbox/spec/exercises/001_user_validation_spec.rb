require "rails_helper"

RSpec.describe User, type: :model do

  describe "email presence validation" do

    context "when email is nil" do
      it "is not valid" do
        user = User.new(email: nil)
        expect(user).not_to be_valid
      end

      it "has an error on :email" do
        user = User.new(email: nil)
        user.valid?
        expect(user.errors[:email]).to be_present
      end

      it "includes 'can't be blank' in email errors" do
        user = User.new(email: nil)
        user.valid?
        expect(user.errors[:email]).to include("can't be blank")
      end
    end

    context "when email is an empty string" do
      it "is not valid" do
        user = User.new(email: "")
        expect(user).not_to be_valid
      end

      it "includes 'can't be blank' in email errors" do
        user = User.new(email: "")
        user.valid?
        expect(user.errors[:email]).to include("can't be blank")
      end
    end

    context "when email is present" do
      it "is valid" do
        user = User.new(email: "test@example.com")
        expect(user).to be_valid
      end

      it "has no errors on :email" do
        user = User.new(email: "test@example.com")
        user.valid?
        expect(user.errors[:email]).to be_empty
      end
    end

  end

end
