describe('Exercise Editor', () => {

  beforeEach(() => {
    cy.stubApi();
    cy.visit('/');
    cy.wait('@getExercises');
    cy.get('[data-cy="category-Validation"]').click();

    cy.contains('Validate Presence of Email').click();
  });

  it('shows the exercise title', () => {
    cy.contains('Validate Presence of Email').should('be.visible');
  });

  it('shows the instructions panel', () => {
    cy.contains('Task Instructions').should('be.visible');
  });

  it('shows the code editor', () => {
    cy.get('.monaco-editor').should('exist');
  });

  it('shows the Run Code button', () => {
    cy.contains('button', 'Run Code').should('be.visible');
  });

  it('shows the file path in the editor header', () => {
    cy.contains('user.rb').should('be.visible');
  });

  it('shows a hint when requested', () => {
    cy.contains('Need a Hint?').click();
    cy.contains('validates').should('be.visible');
  });

});
