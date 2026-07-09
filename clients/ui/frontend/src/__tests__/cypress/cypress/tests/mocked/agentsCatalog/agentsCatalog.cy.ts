/* eslint-disable camelcase */
import { agentsCatalog, agentDetailsPage } from '~/__tests__/cypress/cypress/pages/agentsCatalog';
import { initAgentsCatalogIntercepts } from './agentsCatalogTestUtils';

describe('Agents Catalog Page', () => {
  beforeEach(() => {
    initAgentsCatalogIntercepts();
  });

  it('Agents Catalog tab should be enabled in nav', () => {
    agentsCatalog.visit();
    agentsCatalog.tabEnabled();
  });
});

describe('Agent Details Page', () => {
  beforeEach(() => {
    initAgentsCatalogIntercepts();
  });

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

describe('Agents Catalog Gallery', () => {
  it('should render agent cards when agents are available', () => {
    initAgentsCatalogIntercepts({ agentsPerCategory: 3 });
    agentsCatalog.visit();
    agentsCatalog.findCards().should('have.length.greaterThan', 0);
  });

  it('should display agent name and description in cards', () => {
    initAgentsCatalogIntercepts({ agentsPerCategory: 2 });
    agentsCatalog.visit();
    agentsCatalog.findCardDetailLink('community_agents-agent-1').should('be.visible');
    agentsCatalog.findCardDescription('community_agents-agent-1').should('be.visible');
  });

  it('should navigate to agent details when clicking card link', () => {
    initAgentsCatalogIntercepts({ agentsPerCategory: 1 });
    agentsCatalog.visit();
    agentsCatalog.findCardDetailLink('community_agents-agent-1').click();
    cy.url().should('include', '/agents-catalog/');
  });
});

describe('Agents Catalog Empty States', () => {
  it('should show no-categories state when no sources configured', () => {
    initAgentsCatalogIntercepts({ sources: [], agentsPerCategory: 0 });
    agentsCatalog.visit();
    agentsCatalog.findNoCategoriesState().should('be.visible');
  });
});
