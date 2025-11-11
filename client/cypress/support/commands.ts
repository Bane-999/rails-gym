/* eslint-disable @typescript-eslint/no-namespace */

Cypress.Commands.add('stubApi', () => {
  // Always stub the list endpoint — called on every page load
  cy.intercept('GET', '**/api/exercises', {
    fixture: 'exercises.json',
  }).as('getExercises');

  // Stub individual exercise endpoints only if fixture exists
  // Using a wildcard pattern so missing fixtures don't crash tests
  cy.intercept('GET', '**/api/exercises/001_user_validation', {
    fixture: 'exercise_001.json',
  }).as('getExercise001');

  cy.intercept('GET', '**/api/exercises/002_add_age_to_users', {
    fixture: 'exercise_002.json',
  }).as('getExercise002');

  cy.intercept('GET', '**/api/exercises/003_find_admins', {
    fixture: 'exercise_003.json',
  }).as('getExercise003');

  cy.intercept('GET', '**/api/exercises/004_user_posts_association', {
    fixture: 'exercise_004.json',
  }).as('getExercise004');
});

Cypress.Commands.add('stubRunPass', () => {
  cy.intercept('POST', '**/api/exercises/run', {
    fixture: 'run_pass.json',
  }).as('runCode');
});

Cypress.Commands.add('stubRunFail', () => {
  cy.intercept('POST', '**/api/exercises/run', {
    fixture: 'run_fail.json',
  }).as('runCode');
});

Cypress.Commands.add('stubRunNetworkError', () => {
  cy.intercept('POST', '**/api/exercises/run', {
    forceNetworkError: true,
  }).as('runCode');
});

Cypress.Commands.add('goToCategory', (categoryName: string) => {
  cy.contains(categoryName).click();
});

Cypress.Commands.add('selectExercise', (title: string) => {
  cy.contains(title).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      stubApi(): Chainable<void>;
      stubRunPass(): Chainable<void>;
      stubRunFail(): Chainable<void>;
      stubRunNetworkError(): Chainable<void>;
      goToCategory(categoryName: string): Chainable<void>;
      selectExercise(title: string): Chainable<void>;
    }
  }
}
