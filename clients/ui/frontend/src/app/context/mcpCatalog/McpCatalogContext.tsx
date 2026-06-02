import * as React from 'react';
import { useQueryParamNamespaces } from 'mod-arch-core';
import { BFF_API_VERSION, URL_PREFIX } from '~/app/utilities/const';
import {
  createCatalogContext,
  CatalogProviderState,
} from '~/app/context/catalogContext/createCatalogContext';
import useModelCatalogAPIState, {
  ModelCatalogAPIState,
} from '~/app/hooks/modelCatalog/useModelCatalogAPIState';
import { useCatalogSources } from '~/app/hooks/modelCatalog/useCatalogSources';
import { useCatalogLabels } from '~/app/hooks/modelCatalog/useCatalogLabels';
import { useMcpServerFilterOptionListWithAPI } from '~/app/hooks/mcpServerCatalog/useMcpServerFilterOptionList';
import type {
  McpCatalogContextType,
  McpCatalogPaginationState,
} from '~/app/pages/mcpCatalog/types/mcpCatalogContext';
import type {
  McpCatalogFiltersState,
  McpCatalogFilterOptionsList,
} from '~/app/pages/mcpCatalog/types/mcpCatalogFilterOptions';
import { useMcpUrlSync } from '~/app/pages/mcpCatalog/hooks/useMcpUrlSync';

export type {
  McpCatalogContextType,
  McpCatalogPaginationState,
} from '~/app/pages/mcpCatalog/types/mcpCatalogContext';
export type { McpCatalogFiltersState } from '~/app/pages/mcpCatalog/types/mcpCatalogFilterOptions';

const MODEL_CATALOG_PATH = `${URL_PREFIX}/api/${BFF_API_VERSION}/model_catalog`;
const MCP_CATALOG_PATH = `${URL_PREFIX}/api/${BFF_API_VERSION}/mcp_catalog`;

const defaultPagination: McpCatalogPaginationState = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
};

type McpCatalogExtension = {
  filters: McpCatalogFiltersState;
  setFilters: (
    filters: McpCatalogFiltersState | ((prev: McpCatalogFiltersState) => McpCatalogFiltersState),
  ) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  namedQuery: string | null;
  setNamedQuery: (query: string | null) => void;
  pagination: McpCatalogPaginationState;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (totalItems: number) => void;
  mcpApiState: ModelCatalogAPIState;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const defaultContextValue: McpCatalogContextType = {
  filters: {},
  setFilters: () => undefined,
  searchQuery: '',
  setSearchQuery: () => undefined,
  namedQuery: null,
  setNamedQuery: () => undefined,
  pagination: defaultPagination,
  setPage: () => undefined,
  setPageSize: () => undefined,
  setTotalItems: () => undefined,
  selectedSourceLabel: undefined,
  setSelectedSourceLabel: () => undefined,
  clearAllFilters: () => undefined,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  mcpApiState: { apiAvailable: false, api: null as unknown as ModelCatalogAPIState['api'] },
  catalogSources: null,
  catalogSourcesLoaded: false,
  catalogSourcesLoadError: undefined,
  catalogLabels: null,
  catalogLabelsLoaded: false,
  catalogLabelsLoadError: undefined,
  filterOptions: null,
  filterOptionsLoaded: false,
  filterOptionsLoadError: undefined,
};

function useMcpCatalogExtension(providerState: CatalogProviderState): McpCatalogContextType {
  const queryParams = useQueryParamNamespaces();
  const [apiStateModelCatalog] = useModelCatalogAPIState(MODEL_CATALOG_PATH, queryParams);
  const [apiStateMcpCatalog] = useModelCatalogAPIState(MCP_CATALOG_PATH, queryParams);

  const mcpListParams = React.useMemo(() => ({ assetType: 'mcp_servers' as const }), []);
  const [catalogSources, catalogSourcesLoaded, catalogSourcesLoadError] = useCatalogSources(
    apiStateModelCatalog,
    mcpListParams,
  );
  const [catalogLabels, catalogLabelsLoaded, catalogLabelsLoadError] = useCatalogLabels(
    apiStateModelCatalog,
    mcpListParams,
  );
  const [filterOptions, filterOptionsLoaded, filterOptionsLoadError] =
    useMcpServerFilterOptionListWithAPI(apiStateMcpCatalog);

  const { initialState, syncToUrl } = useMcpUrlSync();

  const [filters, setFilters] = React.useState<McpCatalogFiltersState>(initialState.filters);
  const [searchQuery, setSearchQuery] = React.useState(initialState.searchQuery);
  const [namedQuery, setNamedQuery] = React.useState<string | null>(null);
  const [pagination, setPaginationState] =
    React.useState<McpCatalogPaginationState>(defaultPagination);

  const { setSelectedSourceLabel } = providerState;

  React.useEffect(() => {
    setSelectedSourceLabel(initialState.selectedSourceLabel);
  }, [setSelectedSourceLabel, initialState.selectedSourceLabel]);

  React.useEffect(() => {
    syncToUrl({
      searchQuery,
      filters,
      selectedSourceLabel: providerState.selectedSourceLabel,
    });
  }, [searchQuery, filters, providerState.selectedSourceLabel, syncToUrl]);

  const setPage = React.useCallback((page: number) => {
    setPaginationState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = React.useCallback((pageSize: number) => {
    setPaginationState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setTotalItems = React.useCallback((totalItems: number) => {
    setPaginationState((prev) => ({ ...prev, totalItems }));
  }, []);

  const clearAllFilters = React.useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setNamedQuery(null);
  }, []);

  return React.useMemo<McpCatalogContextType>(
    () => ({
      filters,
      setFilters,
      searchQuery,
      setSearchQuery,
      namedQuery,
      setNamedQuery,
      pagination,
      setPage,
      setPageSize,
      setTotalItems,
      selectedSourceLabel: providerState.selectedSourceLabel,
      setSelectedSourceLabel: providerState.setSelectedSourceLabel,
      clearAllFilters,
      mcpApiState: apiStateMcpCatalog,
      catalogSources,
      catalogSourcesLoaded,
      catalogSourcesLoadError,
      catalogLabels,
      catalogLabelsLoaded,
      catalogLabelsLoadError,
      filterOptions,
      filterOptionsLoaded,
      filterOptionsLoadError,
    }),
    [
      apiStateMcpCatalog,
      filters,
      searchQuery,
      namedQuery,
      pagination,
      providerState.selectedSourceLabel,
      providerState.setSelectedSourceLabel,
      catalogSources,
      catalogSourcesLoaded,
      catalogSourcesLoadError,
      catalogLabels,
      catalogLabelsLoaded,
      catalogLabelsLoadError,
      filterOptions,
      filterOptionsLoaded,
      filterOptionsLoadError,
      setPage,
      setPageSize,
      setTotalItems,
      clearAllFilters,
    ],
  );
}

const {
  Context: McpCatalogContext,
  Provider: McpCatalogContextProvider,
  useContext: useMcpCatalogContext,
} = createCatalogContext<McpCatalogFilterOptionsList, McpCatalogExtension>(
  {
    displayName: 'McpCatalogContextProvider',
    useExtension: useMcpCatalogExtension,
  },
  defaultContextValue,
);

export { McpCatalogContext, McpCatalogContextProvider, useMcpCatalogContext };
