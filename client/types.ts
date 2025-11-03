export type Category = 'Migration' | 'Validation' | 'ActiveRecord' | 'Associations';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface FileNode {
  name: string; // Display name (e.g. "user.rb")
  isFolder: boolean;
  children?: FileNode[];
}

export interface Exercise {
  id: string;
  exercise_id: string; // Unique identifier for the exercise (e.g. "001_user_validation")
  title: string;
  category: string;
  difficulty: Difficulty;
  description: string;

  // State management for multiple files
  defaultOpenPath: string; // Full path e.g. "app/models/user.rb"
  files: Record<string, string>; // Initial content: { "app/models/user.rb": "..." }

  hint: string;
  fileTree: FileNode[]; // Visual structure
}

export interface RunResult {
  passed: boolean;
  output: string;
  duration?: number;
}
