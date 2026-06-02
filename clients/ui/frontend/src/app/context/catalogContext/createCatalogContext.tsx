import * as React from 'react';
import type { CatalogLabelList, CatalogSourceList } from '~/app/modelCatalogTypes';

export type CatalogContextValue<TFilterOptions> = {
  selectedSourceLabel: string | undefined;
  setSelectedSourceLabel: (label: string | undefined) => void;
  filterOptions: TFilterOptions | null;
  filterOptionsLoaded: boolean;
  filterOptionsLoadError?: Error;
  catalogSources: CatalogSourceList | null;
  catalogSourcesLoaded: boolean;
  catalogSourcesLoadError?: Error;
  catalogLabels: CatalogLabelList | null;
  catalogLabelsLoaded: boolean;
  catalogLabelsLoadError?: Error;
  clearAllFilters: () => void;
};

export type CatalogProviderState = {
  selectedSourceLabel: string | undefined;
  setSelectedSourceLabel: (label: string | undefined) => void;
};

export type CatalogContextConfig<TFilterOptions, TExtension> = {
  displayName?: string;
  initialSelectedSourceLabel?: string;
  useExtension: (
    providerState: CatalogProviderState,
  ) => CatalogContextValue<TFilterOptions> & TExtension;
};

type CatalogContextResult<TFilterOptions, TExtension> = {
  Context: React.Context<CatalogContextValue<TFilterOptions> & TExtension>;
  Provider: React.FC<{ children: React.ReactNode }>;
  useContext: () => CatalogContextValue<TFilterOptions> & TExtension;
};

export function createCatalogContext<TFilterOptions, TExtension>(
  config: CatalogContextConfig<TFilterOptions, TExtension>,
  defaultValue: CatalogContextValue<TFilterOptions> & TExtension,
): CatalogContextResult<TFilterOptions, TExtension> {
  type FullContextType = CatalogContextValue<TFilterOptions> & TExtension;

  const Context = React.createContext<FullContextType>(defaultValue);

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedSourceLabel, setSelectedSourceLabel] = React.useState<string | undefined>(
      config.initialSelectedSourceLabel,
    );

    const providerState = React.useMemo<CatalogProviderState>(
      () => ({
        selectedSourceLabel,
        setSelectedSourceLabel,
      }),
      [selectedSourceLabel],
    );

    const value = config.useExtension(providerState);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = config.displayName ?? 'CatalogContextProvider';

  const useCtx = (): FullContextType => React.useContext(Context);

  return { Context, Provider, useContext: useCtx };
}
