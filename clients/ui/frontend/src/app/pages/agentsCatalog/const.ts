import type { AgentFilterCategoryKey } from '~/app/pages/agentsCatalog/types/agentsCatalogFilterOptions';

export const AGENTS_CATALOG_TITLE = 'Agents Catalog';
export const AGENTS_CATALOG_DESCRIPTION =
  'Discover agents that are available for your organization.';

export const AGENT_FILTER_KEYS: AgentFilterCategoryKey[] = ['framework', 'labels'];

export const AGENT_FILTER_CATEGORY_NAMES: Record<AgentFilterCategoryKey, string> = {
  framework: 'Framework',
  labels: 'Labels',
};

export const BACKEND_TO_FRONTEND_AGENT_FILTER_KEY: Record<string, AgentFilterCategoryKey> = {
  tags: 'labels',
};
