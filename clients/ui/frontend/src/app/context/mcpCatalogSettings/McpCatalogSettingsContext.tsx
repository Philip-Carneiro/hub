import * as React from 'react';
import { useQueryParamNamespaces } from 'mod-arch-core';
import useMcpCatalogSettingsAPIState, {
  McpCatalogSettingsAPIState,
} from '~/app/hooks/mcpCatalogSettings/useMcpCatalogSettingsAPIState';
import { useMcpCatalogSourceConfigs } from '~/app/hooks/mcpCatalogSettings/useMcpCatalogSourceConfigs';
import type { McpCatalogSourceConfigList } from '~/app/mcpServerCatalogTypes';
import { BFF_API_VERSION, URL_PREFIX } from '~/app/utilities/const';

export type McpCatalogSettingsContextType = {
  apiState: McpCatalogSettingsAPIState;
  refreshAPIState: () => void;
  mcpCatalogSourceConfigs: McpCatalogSourceConfigList | null;
  mcpCatalogSourceConfigsLoaded: boolean;
  mcpCatalogSourceConfigsLoadError?: Error;
  refreshMcpCatalogSourceConfigs: () => void;
};

type McpCatalogSettingsContextProviderProps = {
  children: React.ReactNode;
};

export const McpCatalogSettingsContext = React.createContext<McpCatalogSettingsContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as McpCatalogSettingsAPIState['api'] },
  refreshAPIState: () => undefined,
  mcpCatalogSourceConfigs: null,
  mcpCatalogSourceConfigsLoaded: false,
  mcpCatalogSourceConfigsLoadError: undefined,
  refreshMcpCatalogSourceConfigs: () => undefined,
});

export const McpCatalogSettingsContextProvider: React.FC<
  McpCatalogSettingsContextProviderProps
> = ({ children }) => {
  const hostPath = `${URL_PREFIX}/api/${BFF_API_VERSION}/settings/mcp_catalog`;
  const queryParams = useQueryParamNamespaces();
  const [apiState, refreshAPIState] = useMcpCatalogSettingsAPIState(hostPath, queryParams);
  const [
    mcpCatalogSourceConfigs,
    mcpCatalogSourceConfigsLoaded,
    mcpCatalogSourceConfigsLoadError,
    refreshMcpCatalogSourceConfigs,
  ] = useMcpCatalogSourceConfigs(apiState);

  const contextValue = React.useMemo(
    () => ({
      apiState,
      refreshAPIState,
      mcpCatalogSourceConfigs,
      mcpCatalogSourceConfigsLoaded,
      mcpCatalogSourceConfigsLoadError,
      refreshMcpCatalogSourceConfigs,
    }),
    [
      apiState,
      refreshAPIState,
      mcpCatalogSourceConfigs,
      mcpCatalogSourceConfigsLoaded,
      mcpCatalogSourceConfigsLoadError,
      refreshMcpCatalogSourceConfigs,
    ],
  );

  return (
    <McpCatalogSettingsContext.Provider value={contextValue}>
      {children}
    </McpCatalogSettingsContext.Provider>
  );
};
