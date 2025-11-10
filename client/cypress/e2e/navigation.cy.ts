describe('Navigation', () => {

  beforeEach(() => {
    cy.stubApi();
    cy.visit('/');
    cy.wait('@getExercises');
  });

  it('navigates to Validation category', () => {
    cy.get('[data-cy="category-Validation"]').click();
    cy.contains('Validate Presence of Email').should('be.visible');
  });

  it('navigates to Migration category', () => {
    cy.get('[data-cy="category-Migration"]').click();
    cy.contains('Add Age Column').should('be.visible');
  });

  it('navigates to ActiveRecord category', () => {
    cy.contains('ActiveRecord').click();
    cy.contains('Find Admins').should('be.visible');
  });

  it('navigates to Associations category', () => {
    cy.contains('Associations').click();
    cy.contains('has many Posts').should('be.visible');
  });

  it('can go back to dashboard from a category', () => {
    cy.get('[data-cy="category-Validation"]').click();
    cy.get('[data-cy="back-button"]').click();
    cy.contains('Rails Gym').should('be.visible');
    cy.contains('Daily Circuit').should('be.visible');
  });

  it('opens an exercise from the category list', () => {
    cy.get('[data-cy="category-Validation"]').click();
    cy.contains('Validate Presence of Email').click();
    cy.contains('Run Code').should('be.visible');
  });

});
