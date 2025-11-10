describe('Run Code', () => {

  const navigateToExercise = () => {
    cy.get('[data-cy="category-Validation"]').click();
    cy.contains('Validate Presence of Email').click();
  };

  describe('when code passes all tests', () => {
    beforeEach(() => {
      cy.stubApi();
      cy.stubRunPass();
      cy.visit('/');
      cy.wait('@getExercises');
      navigateToExercise();
    });

    it('calls the backend with exercise_id and files', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode').then((interception) => {
        expect(interception.request.body).to.have.property('exercise_id');
        expect(interception.request.body).to.have.property('files');
        expect(interception.request.body.exercise_id).to.eq('001_user_validation');
      });
    });

    it('does not send read-only spec files to the backend', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode').then((interception) => {
        const files = interception.request.body.files;
        Object.keys(files).forEach(path => {
          expect(path).not.to.include('spec/');
        });
      });
    });

    it('shows the RSpec output', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains('0 failures').should('be.visible');
    });

    it('shows a success indicator', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains('Specs Passed').should('be.visible');
    });

    it('shows a Next/Finish button after passing', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains(/Next|Finish/).should('be.visible');
    });
  });

  describe('when code fails tests', () => {
    beforeEach(() => {
      cy.stubApi();
      cy.stubRunFail();
      cy.visit('/');
      cy.wait('@getExercises');
      navigateToExercise();
    });

    it('shows the failure output', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains('failures').should('be.visible');
    });

    it('shows a failure indicator', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains('Specs Failed').should('be.visible');
    });

    it('does not show a Next button when failing', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode');
      cy.contains('Next').should('not.exist');
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      cy.stubApi();
      cy.intercept('POST', '**/api/exercises/run', (req) => {
        req.reply({
          delay: 1000,
          fixture: 'run_pass.json',
        });
      }).as('runCode');
      cy.visit('/');
      cy.wait('@getExercises');
      navigateToExercise();
    });

    it('shows loading state while waiting', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.contains('button', /Running|Loading/i).should('exist');
    });
  });

  describe('when backend is unreachable', () => {
    beforeEach(() => {
      cy.stubApi();
      cy.stubRunNetworkError();
      cy.visit('/');
      cy.wait('@getExercises');
      navigateToExercise();
    });

    it('shows a network error message', () => {
      cy.get('[data-cy="run-code-btn"]').click();
      cy.wait('@runCode', { timeout: 10000 });
      cy.contains(/error|unreachable|backend/i).should('be.visible');
    });
  });

});
