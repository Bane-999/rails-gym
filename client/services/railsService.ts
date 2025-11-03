// frontend/src/services/railsService.ts
//
// Connects to the Rails backend which orchestrates Docker execution.
// The backend saves user code to tmp/, runs the sandbox container,
// and returns RSpec results.

import { RunResult, Exercise } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Sends user-submitted code to the Rails backend.
 * Backend writes files to tmp/submissions/, mounts into Docker,
 * runs RSpec inside the sandbox, and returns the output.
 *
 * @param exercise_id  Backend slug e.g. "001_user_validation"
 * @param files        Map of filepath → file content
 * @returns            { passed: boolean, output: string }
 */
export const executeCode = async (
  exercise_id: string,
  files: Record<string, string>
): Promise<RunResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exercise_id,
        files,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      return {
        passed: false,
        output: errorData.error || `Server error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      passed:  data.success  ?? false,
      output:  data.output   ?? '',
    };

  } catch (error) {
    // ── Handle network errors (backend not running, etc.) ──────────────────
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      passed: false,
      output: networkErrorMessage(message),
    };
  }
};

/**
 * Fetches all exercises from the Rails backend.
 * @returns Array of exercises with all metadata
 */
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch exercises:', errorData);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Network error fetching exercises:', message);
    return [];
  }
};

const networkErrorMessage = (error: string): string => `
Network error — could not reach the backend.

Error: ${error}

Make sure the Rails backend is running:
  cd server && rails server
`.trim();
