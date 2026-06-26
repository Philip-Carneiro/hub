import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import McpManageSourcePage from '~/app/pages/mcpCatalogSettings/screens/McpManageSourcePage';
import {
  MCP_ADD_SOURCE_TITLE,
  MCP_MANAGE_SOURCE_TITLE,
  MCP_CATALOG_SETTINGS_PAGE_TITLE,
} from '~/app/routes/mcpCatalogSettings/mcpCatalogSettings';

jest.mock('mod-arch-shared', () => ({
  ApplicationsPage: ({
    children,
    breadcrumb,
  }: {
    children?: React.ReactNode;
    breadcrumb?: React.ReactNode;
  }) => (
    <div>
      {breadcrumb}
      {children}
    </div>
  ),
}));

describe('McpManageSourcePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render in add mode with correct title when no sourceId param', () => {
    render(
      <MemoryRouter initialEntries={['/add-source']}>
        <Routes>
          <Route path="/add-source" element={<McpManageSourcePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-breadcrumb-source-action')).toHaveTextContent(
      MCP_ADD_SOURCE_TITLE,
    );
  });

  it('should render in manage mode with correct title when sourceId param is present', () => {
    render(
      <MemoryRouter initialEntries={['/manage-source/test-source-123']}>
        <Routes>
          <Route path="/manage-source/:sourceId" element={<McpManageSourcePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-breadcrumb-source-action')).toHaveTextContent(
      MCP_MANAGE_SOURCE_TITLE,
    );
  });

  it('should render breadcrumb with MCP catalog settings link', () => {
    render(
      <MemoryRouter initialEntries={['/add-source']}>
        <Routes>
          <Route path="/add-source" element={<McpManageSourcePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const breadcrumbLink = screen.getByText(MCP_CATALOG_SETTINGS_PAGE_TITLE);
    expect(breadcrumbLink).toBeInTheDocument();
    expect(breadcrumbLink.closest('a')).toHaveAttribute('href', '/mcp-catalog-settings');
  });
});
