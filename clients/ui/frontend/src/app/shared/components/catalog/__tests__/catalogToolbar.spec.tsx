import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ModelCatalogContext,
  type ModelCatalogContextType,
} from '~/app/context/modelCatalog/ModelCatalogContext';
import ModelCatalogSourceLabelSelector from '~/app/pages/modelCatalog/screens/ModelCatalogSourceLabelSelector';
import {
  ModelCatalogStringFilterKey,
  ModelCatalogNumberFilterKey,
} from '~/concepts/modelCatalog/const';

jest.mock('mod-arch-kubeflow', () => ({
  useThemeContext: jest.fn(() => ({ isMUITheme: false })),
  Theme: {
    Patternfly: 'Patternfly',
    MUI: 'MUI',
  },
}));

const defaultContext: ModelCatalogContextType = {
  catalogSources: null,
  catalogSourcesLoaded: true,
  catalogSourcesLoadError: undefined,
  catalogLabels: null,
  catalogLabelsLoaded: true,
  catalogLabelsLoadError: undefined,
  filterOptions: null,
  filterOptionsLoaded: true,
  filterOptionsLoadError: undefined,
  selectedSourceLabel: undefined,
  setSelectedSourceLabel: jest.fn(),
  clearAllFilters: jest.fn(),
  selectedSource: undefined,
  updateSelectedSource: jest.fn(),
  apiState: { api: {} as ModelCatalogContextType['apiState']['api'], apiAvailable: false },
  refreshAPIState: jest.fn(),
  filters: {
    [ModelCatalogStringFilterKey.TASK]: [],
    [ModelCatalogStringFilterKey.PROVIDER]: [],
    [ModelCatalogStringFilterKey.LICENSE]: [],
    [ModelCatalogStringFilterKey.LANGUAGE]: [],
    [ModelCatalogStringFilterKey.HARDWARE_TYPE]: [],
    [ModelCatalogStringFilterKey.HARDWARE_CONFIGURATION]: [],
    [ModelCatalogStringFilterKey.USE_CASE]: [],
    [ModelCatalogNumberFilterKey.MAX_RPS]: undefined,
    [ModelCatalogNumberFilterKey.COLD_START_LOAD_TIME]: undefined,
    [ModelCatalogNumberFilterKey.MIN_VRAM]: undefined,
    [ModelCatalogNumberFilterKey.IMAGE_SIZE]: undefined,
    [ModelCatalogStringFilterKey.TENSOR_TYPE]: [],
    [ModelCatalogStringFilterKey.VALIDATED_CONFIGURATION]: [],
  },
  setFilters: jest.fn(),
  performanceViewEnabled: false,
  setPerformanceViewEnabled: jest.fn(),
  performanceFiltersChangedOnDetailsPage: false,
  setPerformanceFiltersChangedOnDetailsPage: jest.fn(),
  lastViewedModelName: null,
  setLastViewedModelName: jest.fn(),
  resetPerformanceFiltersToDefaults: jest.fn(),
  resetSinglePerformanceFilterToDefault: jest.fn(),
  getPerformanceFilterDefaultValue: jest.fn(),
  sortBy: null,
  setSortBy: jest.fn(),
  emptyCategoryLabels: new Set<string>(),
  categoriesResolved: true,
  reportCategoryEmpty: jest.fn(),
  setCategoryCount: jest.fn(),
};

const renderWithContext = (contextOverrides: Partial<ModelCatalogContextType> = {}) => {
  const ctx = { ...defaultContext, ...contextOverrides };
  return render(
    <MemoryRouter>
      <ModelCatalogContext.Provider value={ctx}>
        <ModelCatalogSourceLabelSelector />
      </ModelCatalogContext.Provider>
    </MemoryRouter>,
  );
};

describe('catalogToolbar', () => {
  it('applies toolbar-fieldset-wrapper class to search input to prevent width regression', () => {
    renderWithContext();
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveClass('toolbar-fieldset-wrapper');
  });
});
