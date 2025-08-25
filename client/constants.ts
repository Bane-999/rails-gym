import { Exercise, FileNode } from './types';

// Helper to build a file tree node
const folder = (name: string, children: FileNode[]): FileNode => ({ name, isFolder: true, children });
const file = (name: string): FileNode => ({ name, isFolder: false });

// Standard Rails Tree Skeletons
const railsStructure = (specificNodes: FileNode[]): FileNode[] => {
    // This is a simplified "relevant files only" view
    return specificNodes;
};

export const EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    title: 'Validate Presence of Email',
    category: 'Validation',
    difficulty: 'Easy',
    defaultOpenPath: 'app/models/user.rb',
    files: {
        'app/models/user.rb': `class User < ApplicationRecord
  # TODO: Add validation here

end
`,
        'spec/models/user_spec.rb': `require 'rails_helper'

RSpec.describe User, type: :model do
  it 'requires an email to be present' do
    user = User.new(email: nil)
    expect(user).not_to be_valid
    expect(user.errors[:email]).to include("can't be blank")
  end
end`
    },
    readOnlyPaths: ['spec/models/user_spec.rb'],
    fileTree: [
        folder('app', [
            folder('models', [
                file('user.rb')
            ])
        ])
    ],
    description: `
## Task: Add Validation

The \`User\` model requires an email address to be valid. 
Currently, users can be saved without an email, which causes issues in our mailer service.

**Goal:**
Add a Rails validation to ensure the \`email\` attribute is present.

**Example Usage:**
\`\`\`ruby
user = User.new(email: nil)
user.valid? # Should return false
user.errors[:email] # Should include "can't be blank"
\`\`\`
`,
    hint: "Use `validates :attribute, presence: true`."
  },
  {
    id: 'ex_2',
    title: 'Migration: Add Age Column',
    category: 'Migration',
    difficulty: 'Easy',
    defaultOpenPath: 'db/migrate/20240320120000_add_age_to_users.rb',
    files: {
        'db/migrate/20240320120000_add_age_to_users.rb': `class AddAgeToUsers < ActiveRecord::Migration[7.1]
  def change
    # TODO: Add column here
    
  end
end
`,
        'app/models/user.rb': `class User < ApplicationRecord
end
`,
        'spec/migrations/add_age_spec.rb': `# Hidden spec file`
    },
    readOnlyPaths: ['app/models/user.rb', 'spec/migrations/add_age_spec.rb'],
    fileTree: [
        folder('app', [
            folder('models', [file('user.rb')])
        ]),
        folder('db', [
            folder('migrate', [
                file('20240320120000_add_age_to_users.rb')
            ])
        ])
    ],
    description: `
## Task: Create Migration

We need to store the age of our users. 
Create a migration that adds an integer column named \`age\` to the \`users\` table.

**Goal:**
Complete the \`change\` method in the migration file.

**Requirements:**
- Table: \`users\`
- Column: \`age\`
- Type: \`integer\`
`,
    hint: "Use `add_column :table_name, :column_name, :type`."
  },
  {
    id: 'ex_3',
    title: 'ActiveRecord: Find Admins',
    category: 'ActiveRecord',
    difficulty: 'Medium',
    defaultOpenPath: 'app/services/user_finder.rb',
    files: {
        'app/services/user_finder.rb': `class UserFinder
  def self.admins
    # TODO: Return ActiveRecord relation for admins
    User.none
  end
end
`,
        'app/models/user.rb': `class User < ApplicationRecord
  # scope :admins, -> { where(admin: true) }
end
`,
        'spec/services/user_finder_spec.rb': `require 'rails_helper'`
    },
    readOnlyPaths: ['spec/services/user_finder_spec.rb'],
    fileTree: [
        folder('app', [
            folder('models', [file('user.rb')]),
            folder('services', [file('user_finder.rb')])
        ])
    ],
    description: `
## Task: Scoping

We need a way to find all users who are administrators. 
Assume the \`users\` table has a boolean column \`admin\`.

**Goal:**
Implement the \`admins\` class method to return all users where \`admin\` is true.

**Expected SQL:**
\`SELECT * FROM users WHERE admin = TRUE\`
`,
    hint: "You can use `User.where(condition)`."
  },
  // New Example: Multi-file edit
  {
    id: 'ex_4',
    title: 'Associations: User has many Posts',
    category: 'Associations',
    difficulty: 'Medium',
    defaultOpenPath: 'app/models/user.rb',
    files: {
        'app/models/user.rb': `class User < ApplicationRecord
  # TODO: Add association to posts
end
`,
        'app/models/post.rb': `class Post < ApplicationRecord
  # TODO: Add association to user
end
`,
        'spec/models/associations_spec.rb': `require 'rails_helper'
RSpec.describe "Associations" do
  it "User has many posts" do
    expect(User.new).to respond_to(:posts)
    expect(User.reflect_on_association(:posts).macro).to eq(:has_many)
  end
  it "Post belongs to user" do
    expect(Post.new).to respond_to(:user)
    expect(Post.reflect_on_association(:user).macro).to eq(:belongs_to)
  end
end`
    },
    readOnlyPaths: ['spec/models/associations_spec.rb'],
    fileTree: [
        folder('app', [
            folder('models', [
                file('user.rb'),
                file('post.rb')
            ])
        ])
    ],
    description: `
## Task: Define Associations

We have \`User\` and \`Post\` models. 
A user can have multiple posts, and a post belongs to a single user.

**Goal:**
1. Add \`has_many :posts\` to the User model.
2. Add \`belongs_to :user\` to the Post model.

You can switch between files using the file explorer on the left.
`,
    hint: "Use `has_many` in User and `belongs_to` in Post."
  }
];

export const CATEGORIES = [
    { id: 'Validation', label: 'Validations', description: 'Model integrity constraints' },
    { id: 'Migration', label: 'Migrations', description: 'Schema changes & DDL' },
    { id: 'ActiveRecord', label: 'ActiveRecord', description: 'Queries & Scopes' },
    { id: 'Associations', label: 'Associations', description: 'Relations between models' },
];
