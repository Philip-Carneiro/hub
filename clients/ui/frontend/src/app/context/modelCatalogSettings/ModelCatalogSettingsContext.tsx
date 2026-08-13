import * as React from 'react';
import useModelCatalogSettingsAPIState, {
  ModelCatalogSettingsAPIState,
} from '~/app/hooks/modelCatalogSettings/useModelCatalogSettingsAPIState';
import { useCatalogSourceConfigs } from '~/app/hooks/modelCatalogSettings/useCatalogSourceConfigs';
import type { CatalogSourceList } from '~/app/shared/types/catalogTypes';
import type { CatalogSourceConfigList } from '~/app/modelCatalogTypes';
import { BFF_API_VERSION, URL_PREFIX } from '~/app/utilities/const';
import { createCatalogSettingsContext } from '~/app/shared/catalogSettings/createCatalogSettingsContext';

const { useCatalogSettingsValue } = createCatalogSettingsContext<
  ModelCatalogSettingsAPIState,
  CatalogSourceConfigList
>({
  settingsHostPath: `${URL_PREFIX}/api/${BFF_API_VERSION}/settings/model_catalog`,
  catalogHostPath: `${URL_PREFIX}/api/${BFF_API_VERSION}/model_catalog`,
  useSettingsAPIState: useModelCatalogSettingsAPIState,
  useSourceConfigsList: useCatalogSourceConfigs,
});

export type ModelCatalogSettingsContextType = {
  apiState: ModelCatalogSettingsAPIState;
  refreshAPIState: () => void;
  catalogSourceConfigs: CatalogSourceConfigList | null;
  catalogSourceConfigsLoaded: boolean;
  catalogSourceConfigsLoadError?: Error;
  refreshCatalogSourceConfigs: () => void;
  catalogSources: CatalogSourceList | null;
  catalogSourcesLoaded: boolean;
  catalogSourcesLoadError?: Error;
  refreshCatalogSources: () => void;
  pendingSourceIds: Map<string, string>;
  markSourcePending: (id: string, previousStatus: string) => void;
};

type ModelCatalogSettingsContextProviderProps = {
  children: React.ReactNode;
};

export const ModelCatalogSettingsContext = React.createContext<ModelCatalogSettingsContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as ModelCatalogSettingsAPIState['api'] },
  refreshAPIState: () => undefined,
  catalogSourceConfigs: null,
  catalogSourceConfigsLoaded: false,
  catalogSourceConfigsLoadError: undefined,
  refreshCatalogSourceConfigs: () => undefined,
  catalogSources: null,
  catalogSourcesLoaded: false,
  catalogSourcesLoadError: undefined,
  refreshCatalogSources: () => undefined,
  pendingSourceIds: new Map(),
  markSourcePending: () => undefined,
});

export const ModelCatalogSettingsContextProvider: React.FC<
  ModelCatalogSettingsContextProviderProps
> = ({ children }) => {
  const {
    apiState,
    refreshAPIState,
    sourceConfigs: catalogSourceConfigs,
    sourceConfigsLoaded: catalogSourceConfigsLoaded,
    sourceConfigsLoadError: catalogSourceConfigsLoadError,
    refreshSourceConfigs: refreshCatalogSourceConfigs,
    catalogSources,
    catalogSourcesLoaded,
    catalogSourcesLoadError,
    refreshCatalogSources,
  } = useCatalogSettingsValue();

  const [pendingSourceIds, setPendingSourceIds] = React.useState<Map<string, string>>(new Map());

  const markSourcePending = React.useCallback((id: string, previousStatus: string) => {
    setPendingSourceIds((prev) => {
      const next = new Map(prev);
      next.set(id, previousStatus);
      return next;
    });
  }, []);

  // Clear pending IDs only when the backend returns a genuinely new status
  React.useEffect(() => {
    setPendingSourceIds((prev) => {
      if (prev.size === 0) {
        return prev;
      }
      const next = new Map(prev);
      let changed = false;
      for (const [id, previousStatus] of prev) {
        const source = catalogSources?.items?.find((s) => s.id === id);
        if (!source || source.status !== previousStatus) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [catalogSources]);

  const contextValue = React.useMemo(
    () => ({
      apiState,
      refreshAPIState,
      catalogSourceConfigs,
      catalogSourceConfigsLoaded,
      catalogSourceConfigsLoadError,
      refreshCatalogSourceConfigs,
      catalogSources,
      catalogSourcesLoaded,
      catalogSourcesLoadError,
      refreshCatalogSources,
      pendingSourceIds,
      markSourcePending,
    }),
    [
      apiState,
      refreshAPIState,
      catalogSourceConfigs,
      catalogSourceConfigsLoaded,
      catalogSourceConfigsLoadError,
      refreshCatalogSourceConfigs,
      catalogSources,
      catalogSourcesLoaded,
      catalogSourcesLoadError,
      refreshCatalogSources,
      pendingSourceIds,
      markSourcePending,
    ],
  );

  return (
    <ModelCatalogSettingsContext.Provider value={contextValue}>
      {children}
    </ModelCatalogSettingsContext.Provider>
  );
};
