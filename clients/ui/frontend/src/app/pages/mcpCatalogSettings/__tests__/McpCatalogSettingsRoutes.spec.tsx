import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import McpCatalogSettingsRoutes from '~/app/pages/mcpCatalogSettings/McpCatalogSettingsRoutes';

jest.mock('mod-arch-shared', () => ({
  ApplicationsPage: ({
    children,
    emptyStatePage,
    breadcrumb,
  }: {
    children?: React.ReactNode;
    emptyStatePage?: React.ReactNode;
    breadcrumb?: React.ReactNode;
  }) => (
    <div>
      {breadcrumb}
      {emptyStatePage}
      {children}
    </div>
  ),
  ProjectObjectType: { mcpCatalog: 'mcpCatalog' },
  TitleWithIcon: ({ title }: { title: string }) => <span>{title}</span>,
}));

jest.mock('~/app/context/mcpCatalogSettings/McpCatalogSettingsContext', () => ({
  McpCatalogSettingsContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('McpCatalogSettingsRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <McpCatalogSettingsRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-catalog-settings-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No MCP sources')).toBeInTheDocument();
  });

  it('should render add-source page at add-source route', () => {
    render(
      <MemoryRouter initialEntries={['/add-source']}>
        <McpCatalogSettingsRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-breadcrumb-source-action')).toBeInTheDocument();
  });

  it('should redirect unknown routes to root', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <McpCatalogSettingsRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-catalog-settings-empty-state')).toBeInTheDocument();
  });
});
