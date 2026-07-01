import { restCREATE, handleRestFailures } from 'mod-arch-core';
import { previewMcpCatalogSource } from '~/app/api/mcpCatalogSettings/service';

const mockRestPromise = Promise.resolve({ data: {} });

jest.mock('mod-arch-core', () => ({
  restCREATE: jest.fn(() => mockRestPromise),
  assembleModArchBody: jest.fn((data) => data),
  isModArchResponse: jest.fn(() => true),
  handleRestFailures: jest.fn(() => mockRestPromise),
}));

const handleRestFailuresMock = jest.mocked(handleRestFailures);
const restCREATEMock = jest.mocked(restCREATE);

const APIOptionsMock = {};

describe('previewMcpCatalogSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include assetType mcp_servers in query params', async () => {
    const mockData = {
      type: 'yaml',
      includedServers: ['*'],
      excludedServers: [],
      properties: { yaml: 'servers:\n  - name: test' },
    };

    await previewMcpCatalogSource('/api/v1/settings/mcp_catalog', { namespace: 'kubeflow' })(
      APIOptionsMock,
      mockData,
    );

    expect(restCREATEMock).toHaveBeenCalledTimes(1);
    expect(restCREATEMock).toHaveBeenCalledWith(
      '/api/v1/settings/mcp_catalog',
      '/source_preview',
      mockData,
      { namespace: 'kubeflow', assetType: 'mcp_servers' },
      APIOptionsMock,
    );
    expect(handleRestFailuresMock).toHaveBeenCalledTimes(1);
  });

  it('should merge additional query params with assetType', async () => {
    const mockData = {
      type: 'yaml',
      includedServers: ['*'],
      excludedServers: [],
      properties: { yaml: 'servers:\n  - name: test' },
    };

    await previewMcpCatalogSource('/api/v1/settings/mcp_catalog', { namespace: 'kubeflow' })(
      APIOptionsMock,
      mockData,
      { filterStatus: 'included', pageSize: 20 },
    );

    expect(restCREATEMock).toHaveBeenCalledTimes(1);
    expect(restCREATEMock).toHaveBeenCalledWith(
      '/api/v1/settings/mcp_catalog',
      '/source_preview',
      mockData,
      { namespace: 'kubeflow', assetType: 'mcp_servers', filterStatus: 'included', pageSize: 20 },
      APIOptionsMock,
    );
  });

  it('should include nextPageToken in query params when provided', async () => {
    const mockData = {
      type: 'yaml',
      includedServers: ['*'],
      excludedServers: [],
      properties: { yaml: 'servers:\n  - name: test' },
    };

    await previewMcpCatalogSource('/api/v1/settings/mcp_catalog', { namespace: 'kubeflow' })(
      APIOptionsMock,
      mockData,
      { filterStatus: 'excluded', pageSize: 10, nextPageToken: 'abc123' },
    );

    expect(restCREATEMock).toHaveBeenCalledWith(
      '/api/v1/settings/mcp_catalog',
      '/source_preview',
      mockData,
      {
        namespace: 'kubeflow',
        assetType: 'mcp_servers',
        filterStatus: 'excluded',
        pageSize: 10,
        nextPageToken: 'abc123',
      },
      APIOptionsMock,
    );
  });

  it('should preserve assetType even when additional params override base params', async () => {
    const mockData = {
      type: 'yaml',
      includedServers: [],
      excludedServers: [],
      properties: {},
    };

    await previewMcpCatalogSource('/api/v1/settings/mcp_catalog', { someKey: 'base' })(
      APIOptionsMock,
      mockData,
      { filterStatus: 'all' },
    );

    expect(restCREATEMock).toHaveBeenCalledWith(
      '/api/v1/settings/mcp_catalog',
      '/source_preview',
      mockData,
      { someKey: 'base', assetType: 'mcp_servers', filterStatus: 'all' },
      APIOptionsMock,
    );
  });
});
