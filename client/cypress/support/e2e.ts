import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver')) return false;
  if (err.message.includes('Cannot read properties of null')) return false;
  return true;
});
