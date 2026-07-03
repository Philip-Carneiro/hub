import { agentsCatalog, agentDetailsPage } from '~/__tests__/cypress/cypress/pages/agentsCatalog';

describe('Agents Catalog Page', () => {
  it('Agents Catalog tab should be enabled in nav', () => {
    agentsCatalog.visit();
    agentsCatalog.tabEnabled();
  });
});

describe('Agent Details Page', () => {
  it('should display breadcrumb with link back to catalog', () => {
    agentDetailsPage.visit('my-agent');
    agentDetailsPage.findBreadcrumbCatalogLink().should('be.visible');
  });

  it('should display agent name in breadcrumb', () => {
    agentDetailsPage.visit('my-agent');
    agentDetailsPage.findBreadcrumbAgentName().should('contain', 'my-agent');
  });

  it('breadcrumb link should navigate back to catalog', () => {
    agentDetailsPage.visit('test-agent');
    agentDetailsPage.findBreadcrumbCatalogLink().click();
    agentsCatalog.findPageTitle().should('be.visible');
  });

  it('should redirect from :agentName to :agentName/overview', () => {
    cy.visit('/agents-catalog/test-agent');
    cy.url().should('include', '/agents-catalog/test-agent/overview');
  });
});
