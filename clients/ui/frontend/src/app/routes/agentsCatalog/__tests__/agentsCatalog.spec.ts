import { getAgentsCatalogDetailsRoute } from '~/app/routes/agentsCatalog/agentsCatalog';

describe('getAgentsCatalogDetailsRoute', () => {
  it('should encode agent name with spaces', () => {
    expect(getAgentsCatalogDetailsRoute({ agentName: 'agent with spaces' })).toBe(
      '/agents-catalog/agent%20with%20spaces',
    );
  });

  it('should encode special characters in agent name', () => {
    expect(getAgentsCatalogDetailsRoute({ agentName: 'agent/with/slashes' })).toBe(
      '/agents-catalog/agent%2Fwith%2Fslashes',
    );
  });

  it('should include sourceId in path when provided', () => {
    expect(getAgentsCatalogDetailsRoute({ sourceId: 'src-1', agentName: 'my-agent' })).toBe(
      '/agents-catalog/src-1/my-agent',
    );
  });
});
