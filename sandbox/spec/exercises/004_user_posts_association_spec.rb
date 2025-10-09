require "rails_helper"

RSpec.describe "004 User has many Posts", type: :model do
  describe "User" do

    describe "has_many :posts association" do
      it "is declared on the User model" do
        reflection = User.reflect_on_association(:posts)
        expect(reflection).not_to be_nil,
          "Expected User to have association :posts but none was found. " \
          "Did you add `has_many :posts` to the User model?"
      end

      it "is a has_many association" do
        reflection = User.reflect_on_association(:posts)
        expect(reflection.macro).to eq(:has_many)
      end

      it "allows accessing posts through a user instance" do
        user = create(:user)
        expect(user).to respond_to(:posts)
      end

      it "returns posts belonging to the user" do
        user = create(:user)
        post = Post.create!(title: "My Post", user_id: user.id)

        expect(user.posts).to include(post)
      end

      it "does not return posts belonging to other users" do
        user_a = create(:user)
        user_b = create(:user)
        post_b = Post.create!(title: "User B post", user_id: user_b.id)

        expect(user_a.posts).not_to include(post_b)
      end

      it "returns an empty collection when user has no posts" do
        user = create(:user)
        expect(user.posts).to be_empty
      end
    end

  end

  describe "Post" do

    describe "belongs_to :user association" do
      it "is declared on the Post model" do
        reflection = Post.reflect_on_association(:user)
        expect(reflection).not_to be_nil,
          "Expected Post to have association :user but none was found. " \
          "Did you add `belongs_to :user` to the Post model?"
      end

      it "is a belongs_to association" do
        reflection = Post.reflect_on_association(:user)
        expect(reflection.macro).to eq(:belongs_to)
      end

      it "allows accessing the user through a post instance" do
        post = Post.new
        expect(post).to respond_to(:user)
      end

      it "returns the correct user for a post" do
        user = create(:user, name: "Alice")
        post = Post.create!(title: "My Post", user_id: user.id)

        expect(post.user).to eq(user)
        expect(post.user.name).to eq("Alice")
      end
    end

  end

  describe "full association" do
    it "works bidirectionally" do
      user = create(:user, name: "Alice")
      post = Post.create!(title: "Hello World", user_id: user.id)

      # From user to post
      expect(user.posts).to include(post)

      # From post to user
      expect(post.user).to eq(user)
    end

    it "user can have multiple posts" do
      user  = create(:user)
      post1 = Post.create!(title: "First",  user_id: user.id)
      post2 = Post.create!(title: "Second", user_id: user.id)
      post3 = Post.create!(title: "Third",  user_id: user.id)

      expect(user.posts.count).to eq(3)
      expect(user.posts).to include(post1, post2, post3)
    end
  end
end
