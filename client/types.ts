export type Category = 'Migration' | 'Validation' | 'ActiveRecord' | 'Associations';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface FileNode {
  name: string; // Display name (e.g. "user.rb")
  isFolder: boolean;
  children?: FileNode[];
}

export interface Exercise {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  
  // State management for multiple files
  defaultOpenPath: string; // Full path e.g. "app/models/user.rb"
  files: Record<string, string>; // Initial content: { "app/models/user.rb": "..." }
  readOnlyPaths: string[]; // Paths that cannot be edited e.g. ["spec/models/user_spec.rb"]
  
  hint: string;
  fileTree: FileNode[]; // Visual structure
}

export interface RunResult {
  passed: boolean;
  output: string;
  duration?: number;
}
