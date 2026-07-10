import * as React from 'react';
import { ApplicationsPage } from 'mod-arch-shared';
import { SearchIcon } from '@patternfly/react-icons';
import { Flex, FlexItem } from '@patternfly/react-core';
import { AgentsCatalogContext } from '~/app/context/agentsCatalog/AgentsCatalogContext';
import AgentsCatalogFilters from '~/app/pages/agentsCatalog/components/AgentsCatalogFilters';
import { AGENTS_CATALOG_TITLE, AGENTS_CATALOG_DESCRIPTION } from '~/app/pages/agentsCatalog/const';
import { CatalogPageLayout, EmptyCatalogState } from '~/app/shared/components/catalog';
import AgentsCatalogIcon from '~/app/pages/agentsCatalog/AgentsCatalogIcon';
import AgentsCatalogSourceLabelSelector from './AgentsCatalogSourceLabelSelector';
import AgentsCatalogGalleryView from './AgentsCatalogGalleryView';

const ICON_SIZE = 40;
const ICON_PADDING = 4;

const AgentsCatalogTitle: React.FC = () => (
  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
    <FlexItem>
      <div
        style={{
          background: 'var(--pf-t--global--color--nonstatus--purple--default)',
          borderRadius: ICON_SIZE / 2,
          padding: ICON_PADDING,
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      >
        <AgentsCatalogIcon
          color="black"
          style={{
            width: ICON_SIZE - ICON_PADDING * 2,
            height: ICON_SIZE - ICON_PADDING * 2,
          }}
        />
      </div>
    </FlexItem>
    <FlexItem>{AGENTS_CATALOG_TITLE}</FlexItem>
  </Flex>
);

const AgentsCatalog: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    clearAllFilters,
    selectedSourceLabel,
    setSelectedSourceLabel,
    catalogSources,
    catalogLabels,
    catalogSourcesLoaded,
    emptyCategoryLabels,
    setCategoryCount,
  } = React.useContext(AgentsCatalogContext);

  // ponytail: agents catalog always shows flat gallery, no category grouping
  const isAllAgentsView = false;

  const handleSearch = React.useCallback(
    (term: string) => {
      setSearchQuery(term);
    },
    [setSearchQuery],
  );

  const handleClearSearch = React.useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleResetAllFilters = React.useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  return (
    <ApplicationsPage
      title={<AgentsCatalogTitle />}
      description={AGENTS_CATALOG_DESCRIPTION}
      empty={false}
      loaded
      provideChildrenPadding
    >
      <CatalogPageLayout
        catalogSources={catalogSources}
        catalogLabels={catalogLabels}
        catalogSourcesLoaded={catalogSourcesLoaded}
        selectedSourceLabel={selectedSourceLabel}
        onSelectSourceLabel={setSelectedSourceLabel}
        isAllItemsView={isAllAgentsView}
        emptyCategoryLabels={emptyCategoryLabels}
        setCategoryCount={setCategoryCount}
        renderEmptyCategoriesState={() => (
          <EmptyCatalogState
            testid="empty-agents-catalog-no-categories"
            title="No agents available"
            headerIcon={SearchIcon}
            description="There are no agent categories available. Configure sources in settings to get started."
          />
        )}
        renderFilterSidebar={() => <AgentsCatalogFilters />}
        renderToolbar={() => (
          <AgentsCatalogSourceLabelSelector
            searchTerm={searchQuery}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            onResetAllFilters={handleResetAllFilters}
          />
        )}
        renderAllItemsView={() => null}
        renderGalleryView={(isSingleCategory, singleCategoryLabel) => (
          <AgentsCatalogGalleryView
            handleFilterReset={handleResetAllFilters}
            isSingleCategory={isSingleCategory}
            singleCategoryLabel={singleCategoryLabel}
          />
        )}
      />
    </ApplicationsPage>
  );
};

export default AgentsCatalog;
