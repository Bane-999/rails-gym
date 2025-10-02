import { Exercise, Category } from './types';

// helper functions — keep these
const file = (name: string) => ({ name, isFolder: false });
const folder = (name: string, children: any[]) => ({ name, isFolder: true, children });

export const EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    exercise_id: '001_user_validation',
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
    exercise_id: '002_add_age_to_users',
    title: 'Migration: Add Age Column',
    category: 'Migration',
    difficulty: 'Easy',
    defaultOpenPath: 'db/migrate/20240320120000_add_age_to_users.rb',
    files: {
      'db/migrate/20240320120000_add_age_to_users.rb': `class AddAgeToUsers < ActiveRecord::Migration[8.0]
  def change
    # TODO: Add column here

  end
end
`,
      'app/models/user.rb': `class User < ApplicationRecord
end
`
    },
    readOnlyPaths: ['app/models/user.rb'],
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
    exercise_id: '003_find_admins',
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
end
`
    },
    readOnlyPaths: ['app/models/user.rb'],
    fileTree: [
      folder('app', [
        folder('models', [file('user.rb')]),
        folder('services', [file('user_finder.rb')])
      ])
    ],
    description: `
## Task: ActiveRecord Query

We need a way to find all users who are administrators.
Assume the \`users\` table has a boolean column \`admin\`.

**Goal:**
Implement the \`admins\` class method to return all users where \`admin\` is true.

**Expected SQL:**
\`SELECT * FROM users WHERE admin = TRUE\`
`,
    hint: "Use `User.where(condition)`."
  },

  {
    id: 'ex_4',
    exercise_id: '004_user_posts_association',
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
`
    },
    readOnlyPaths: [],
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
  { id: 'Validation',   label: 'Validations',  description: 'Model integrity constraints' },
  { id: 'Migration',    label: 'Migrations',    description: 'Schema changes & DDL' },
  { id: 'ActiveRecord', label: 'ActiveRecord',  description: 'Queries & Scopes' },
  { id: 'Associations', label: 'Associations',  description: 'Relations between models' },
];
