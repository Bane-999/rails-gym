describe('Dashboard', () => {

  beforeEach(() => {
    cy.stubApi();
    cy.visit('/');
    cy.wait('@getExercises');
  });

  it('shows the Rails Gym title', () => {
    cy.contains('Rails Gym').should('be.visible');
  });

  it('shows all four categories', () => {
    cy.contains('Validations').should('be.visible');
    cy.contains('Migrations').should('be.visible');
    cy.contains('ActiveRecord').should('be.visible');
    cy.contains('Associations').should('be.visible');
  });

  it('shows the Daily Circuit section', () => {
    cy.contains('Daily Circuit').should('be.visible');
  });

  it('has a Start button for the circuit', () => {
    cy.contains('button', 'Start').should('be.visible');
  });

});
