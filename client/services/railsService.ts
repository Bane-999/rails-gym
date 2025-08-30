import { RunResult } from '../types';

/**
 * Simulates sending code to the backend Rails/Docker service.
 * In a real app, this would be a POST request to the API with all modified files.
 */
export const executeCode = async (exerciseId: string, files: Record<string, string>): Promise<RunResult> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock logic to determine pass/fail based on string analysis
  // In the real app, this logic happens in RSpec inside Docker
  let passed = false;
  let output = "";

  // Helper to extract content safeley
  const getContent = (path: string) => files[path] || "";

  if (exerciseId === 'ex_1') {
    const code = getContent('app/models/user.rb');
    if (code.includes('validates :email') && code.includes('presence: true')) {
      passed = true;
      output = `
Randomized with seed 54321
.

Finished in 0.00231 seconds (files took 0.08 seconds to load)
1 example, 0 failures
`;
    } else {
      passed = false;
      output = `
Randomized with seed 54321
F

Failures:

  1) User validation requires email to be present
     Failure/Error: expect(user).not_to be_valid
       expected #<User id: nil, email: nil> not to be valid
     # ./spec/models/user_spec.rb:10:in \`block (2 levels) in <top (required)>'

Finished in 0.0123 seconds (files took 0.08 seconds to load)
1 example, 1 failure
`;
    }
  } else if (exerciseId === 'ex_2') {
    const code = getContent('db/migrate/20240320120000_add_age_to_users.rb');
    if (code.includes('add_column :users, :age, :integer')) {
        passed = true;
        output = `
== 20240320120000 AddAgeToUsers: migrating ====================================
-- add_column(:users, :age, :integer)
   -> 0.0012s
== 20240320120000 AddAgeToUsers: migrated (0.0013s) ===========================

Randomized with seed 1234
.

Finished in 0.005 seconds
1 example, 0 failures
`;
    } else {
        passed = false;
        output = `
Randomized with seed 1234
F

Failures:

  1) AddAgeToUsers adds age column to users table
     Failure/Error: expect(ActiveRecord::Base.connection.column_exists?(:users, :age)).to be_truthy
       expected: true
            got: false
     # ./spec/migrations/add_age_spec.rb:15

Finished in 0.005 seconds
1 example, 1 failure
`;
    }
  } else if (exerciseId === 'ex_3') {
    const code = getContent('app/services/user_finder.rb');
    if (code.includes('User.where(admin: true)')) {
        passed = true;
        output = `
Randomized with seed 9999
..

Finished in 0.02 seconds
2 examples, 0 failures
`;
    } else {
        passed = false;
        output = `
Randomized with seed 9999
F

Failures:

  1) UserFinder.admins returns only admin users
     Failure/Error: expect(result).to include(admin_user)
       expected [] to include #<User id: 1, admin: true>
     # ./spec/services/user_finder_spec.rb:20

Finished in 0.02 seconds
1 example, 1 failure
`;
    }
  } else if (exerciseId === 'ex_4') {
     const userCode = getContent('app/models/user.rb');
     const postCode = getContent('app/models/post.rb');

     if (userCode.includes('has_many :posts') && postCode.includes('belongs_to :user')) {
        passed = true;
        output = `
Randomized with seed 7777
..

Finished in 0.05 seconds
2 examples, 0 failures
`;
     } else {
        passed = false;
        output = `
Randomized with seed 7777
F.

Failures:

  1) Associations User has many posts
     Failure/Error: expect(User.reflect_on_association(:posts).macro).to eq(:has_many)
       expected: :has_many
            got: nil
     # ./spec/models/associations_spec.rb:5

Finished in 0.05 seconds
2 examples, 1 failure
`;
     }
  }

  return { passed, output };
};
