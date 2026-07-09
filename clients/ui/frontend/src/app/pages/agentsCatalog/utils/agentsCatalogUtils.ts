import type { AgentsCatalogFiltersState } from '~/app/pages/agentsCatalog/types/agentsCatalogFilterOptions';
import {
  AGENT_FILTER_KEYS,
  BACKEND_TO_FRONTEND_AGENT_FILTER_KEY,
} from '~/app/pages/agentsCatalog/const';
import { stringFiltersToFilterQuery } from '~/app/shared/components/catalog';

export const hasAgentFiltersApplied = (
  filters: AgentsCatalogFiltersState,
  searchQuery: string,
): boolean => {
  if (searchQuery && searchQuery.trim().length > 0) {
    return true;
  }
  for (const key of AGENT_FILTER_KEYS) {
    const value = filters[key];
    if (Array.isArray(value) && value.length > 0) {
      return true;
    }
  }
  return false;
};

const FRONTEND_TO_BACKEND_AGENT_FILTER_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(BACKEND_TO_FRONTEND_AGENT_FILTER_KEY).map(([backend, frontend]) => [
    frontend,
    backend,
  ]),
);

export function agentFiltersToFilterQuery(filters: AgentsCatalogFiltersState): string {
  return stringFiltersToFilterQuery(filters, FRONTEND_TO_BACKEND_AGENT_FILTER_KEY);
}
