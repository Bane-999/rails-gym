import { RunResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Sends user code to the Rails backend which runs it inside Docker.
 * Uses exercise_id (backend slug) not the frontend ex_1/ex_2 id.
 */
export const executeCode = async (
  exercise_id: string,
  files: Record<string, string>
): Promise<RunResult> => {
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
    const error = await response.json();
    return {
      passed: false,
      output: error.error || 'Request failed',
    };
  }

  const data = await response.json();

  return {
    passed: data.success,
    output: data.output,
  };
};
