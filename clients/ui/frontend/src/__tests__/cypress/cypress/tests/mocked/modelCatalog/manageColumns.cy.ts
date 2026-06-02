/* eslint-disable camelcase */
import { modelCatalog } from '~/__tests__/cypress/cypress/pages/modelCatalog';
import { mockModelRegistry } from '~/__mocks__/mockModelRegistry';
import {
  setupModelCatalogIntercepts,
  interceptPerformanceArtifactsList,
  interceptArtifactsList,
  type ModelCatalogInterceptOptions,
} from '~/__tests__/cypress/cypress/support/interceptHelpers/modelCatalog';
import { NBSP } from '~/__tests__/cypress/cypress/support/constants';
import {
  DEFAULT_VISIBLE_COLUMN_FIELDS,
  HARDWARE_CONFIG_COLUMNS_STORAGE_KEY as STORAGE_KEY,
} from '~/app/pages/modelCatalog/components/HardwareConfigurationTableColumns';

const initIntercepts = (options: Partial<ModelCatalogInterceptOptions> = {}) => {
  const resolvedOptions = {
    useValidatedModel: true,
    includePerformanceArtifacts: true,
    ...options,
  };

  setupModelCatalogIntercepts(resolvedOptions);

  if (resolvedOptions.includePerformanceArtifacts) {
    interceptArtifactsList();
    interceptPerformanceArtifactsList();
  }
};

const navigateToPerformanceInsights = () => {
  modelCatalog.visit();
  modelCatalog.findLoadingState().should('not.exist');
  modelCatalog.findModelCatalogDetailLink().first().click();
  modelCatalog.clickPerformanceInsightsTab();
};

const navigateWithPerformanceView = () => {
  modelCatalog.visit();
  modelCatalog.findLoadingState().should('not.exist');
  modelCatalog.togglePerformanceView();
  modelCatalog.findModelCatalogDetailLink().first().click();
  modelCatalog.clickPerformanceInsightsTab();
};

describe('Manage Columns Modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '/model-registry/api/v1/model_registry*', [
      mockModelRegistry({ name: 'modelregistry-sample' }),
    ]).as('getModelRegistries');

    cy.clearLocalStorage(STORAGE_KEY);
    initIntercepts();
  });

  describe('Opening the Modal', () => {
    it('should open the modal when clicking the Customize columns button', () => {
      navigateToPerformanceInsights();

      modelCatalog.findManageColumnsButton().should('be.visible');
      modelCatalog.openManageColumnsModal();
    });

    it('should display search input and column list in the modal', () => {
      navigateToPerformanceInsights();
      modelCatalog.openManageColumnsModal();

      modelCatalog.findManageColumnsSearch().should('be.visible');
      modelCatalog.findManageColumnsUpdateButton().should('be.visible');
      modelCatalog.findManageColumnsCancelButton().should('be.visible');
      modelCatalog.findManageColumnsRestoreDefaults().should('be.visible');
    });
  });

  describe('Sticky Columns Exclusion', () => {
    it('should not show sticky columns in the modal', () => {
      navigateToPerformanceInsights();
      modelCatalog.openManageColumnsModal();

      modelCatalog.findManageColumnsModal().should('not.contain.text', 'Hardware configuration');
      modelCatalog.findManageColumnsModal().should('not.contain.text', 'Workload type');
    });

    it('should always show sticky columns in the table regardless of manage columns settings', () => {
      navigateToPerformanceInsights();

      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('contain.text', 'Hardware configuration');
      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Workload type');
    });
  });

  describe('Toggling Columns Off/On', () => {
    it('should remove a column from the table when unchecked and Update is clicked', () => {
      navigateToPerformanceInsights();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');
    });

    it('should add a column back when re-checked and Update is clicked', () => {
      const columnsWithoutReplicas = DEFAULT_VISIBLE_COLUMN_FIELDS.filter(
        (col) => col !== 'replicas',
      );
      cy.window().then((win) => {
        win.localStorage.setItem(STORAGE_KEY, JSON.stringify(columnsWithoutReplicas));
      });

      navigateToPerformanceInsights();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').check();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');
    });

    it('should not apply changes when Cancel is clicked', () => {
      navigateToPerformanceInsights();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnsCancelButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');
    });

    it('should toggle multiple columns at once', () => {
      navigateToPerformanceInsights();

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnCheckbox('vLLM Version').uncheck();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');
      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('not.contain.text', 'vLLM Version');
    });
  });

  describe('Column Visibility Persistence', () => {
    it('should persist column visibility to localStorage', () => {
      navigateToPerformanceInsights();

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnsUpdateButton().click();

      cy.window().then((win) => {
        const stored = win.localStorage.getItem(STORAGE_KEY);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stored).to.not.be.null;
        const parsed = JSON.parse(stored!);
        expect(parsed).to.be.an('array');
        expect(parsed).to.not.include('replicas');
      });
    });

    it('should restore column visibility from localStorage on reload', () => {
      navigateToPerformanceInsights();

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');

      navigateToPerformanceInsights();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');
    });
  });

  describe('Restore Defaults', () => {
    it('should restore default column visibility when Restore default columns is clicked', () => {
      navigateToPerformanceInsights();

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnCheckbox('Replicas').uncheck();
      modelCatalog.findManageColumnCheckbox('vLLM Version').uncheck();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'Replicas');
      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('not.contain.text', 'vLLM Version');

      modelCatalog.openManageColumnsModal();
      modelCatalog.findManageColumnsRestoreDefaults().click();
      modelCatalog.findManageColumnsUpdateButton().click();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');
      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'vLLM Version');
    });
  });

  describe('Latency Filter Interaction with Column Visibility', () => {
    it('should update visible columns when latency filter is applied', () => {
      navigateWithPerformanceView();

      modelCatalog.openLatencyFilter();
      modelCatalog.selectLatencyMetric('E2E');
      modelCatalog.selectLatencyPercentile('Mean');
      modelCatalog.clickApplyFilter();

      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('contain.text', `E2E${NBSP}Latency Mean`);
      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', `TPS${NBSP}Mean`);

      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'TTFT');
      modelCatalog.findHardwareConfigurationTableHeaders().should('not.contain.text', 'ITL');
    });

    it('should reflect latency filter changes in the manage columns modal state', () => {
      navigateWithPerformanceView();

      modelCatalog.openLatencyFilter();
      modelCatalog.selectLatencyMetric('ITL');
      modelCatalog.selectLatencyPercentile('P95');
      modelCatalog.clickApplyFilter();

      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('contain.text', `ITL${NBSP}Latency P95`);
      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', `TPS${NBSP}P95`);

      modelCatalog.openManageColumnsModal();

      modelCatalog.findManageColumnCheckbox(`ITL${NBSP}Latency P95`).should('be.checked');
      modelCatalog.findManageColumnCheckbox(`TPS${NBSP}P95`).should('be.checked');
    });

    it('should keep non-latency columns unchanged when latency filter updates column visibility', () => {
      navigateWithPerformanceView();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');

      modelCatalog.openLatencyFilter();
      modelCatalog.selectLatencyMetric('E2E');
      modelCatalog.selectLatencyPercentile('P99');
      modelCatalog.clickApplyFilter();

      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Replicas');
      modelCatalog
        .findHardwareConfigurationTableHeaders()
        .should('contain.text', 'Hardware configuration');
      modelCatalog.findHardwareConfigurationTableHeaders().should('contain.text', 'Workload type');
    });
  });

  describe('Search', () => {
    it('should filter columns when typing in the search input', () => {
      navigateToPerformanceInsights();
      modelCatalog.openManageColumnsModal();

      modelCatalog.findManageColumnsSearch().type('TTFT');

      modelCatalog.findManageColumnsModal().should('contain.text', `TTFT${NBSP}Latency Mean`);
      modelCatalog.findManageColumnsModal().should('contain.text', `TTFT${NBSP}Latency P90`);
      modelCatalog.findManageColumnsModal().should('not.contain.text', 'Replicas');
      modelCatalog.findManageColumnsModal().should('not.contain.text', 'vLLM Version');
    });
  });
});
