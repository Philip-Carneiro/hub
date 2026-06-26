import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import McpCatalogSettings from '~/app/pages/mcpCatalogSettings/screens/McpCatalogSettings';

jest.mock('mod-arch-shared', () => ({
  ApplicationsPage: ({
    children,
    emptyStatePage,
  }: {
    children?: React.ReactNode;
    emptyStatePage?: React.ReactNode;
  }) => (
    <div>
      {emptyStatePage}
      {children}
    </div>
  ),
  ProjectObjectType: { mcpCatalog: 'mcpCatalog' },
  TitleWithIcon: ({ title }: { title: string }) => <span>{title}</span>,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('McpCatalogSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the empty state with correct title', () => {
    render(
      <MemoryRouter>
        <McpCatalogSettings />
      </MemoryRouter>,
    );

    expect(screen.getByText('No MCP sources')).toBeInTheDocument();
    expect(
      screen.getByText('No MCP sources have been configured. Add a source to get started.'),
    ).toBeInTheDocument();
  });

  it('should render the "Add a source" button', () => {
    render(
      <MemoryRouter>
        <McpCatalogSettings />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mcp-add-source-button-empty')).toBeInTheDocument();
    expect(screen.getByTestId('mcp-add-source-button-empty')).toHaveTextContent('Add a source');
  });

  it('should navigate to add-source URL when clicking "Add a source" button', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <McpCatalogSettings />
      </MemoryRouter>,
    );

    const addButton = screen.getByTestId('mcp-add-source-button-empty');
    await user.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/mcp-catalog-settings/add-source');
  });
});
