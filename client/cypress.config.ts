import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL of our Vite dev server
    baseUrl: 'http://localhost:5173',

    // Where our spec files live
    specPattern: 'cypress/e2e/**/*.cy.ts',

    // Viewport size — desktop
    viewportWidth: 1440,
    viewportHeight: 900,

    // Don't record videos in CI (saves space)
    video: false,

    // Screenshot on failure only
    screenshotOnRunFailure: true,

    // How long to wait for elements
    defaultCommandTimeout: 8000,

    // How long to wait for the backend
    responseTimeout: 30000,

    // Environment variables available in tests
    env: {
      apiUrl: 'http://localhost:3000/api',
    },
  },
});
