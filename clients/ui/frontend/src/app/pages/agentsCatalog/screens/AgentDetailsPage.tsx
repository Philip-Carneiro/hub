import * as React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { ApplicationsPage } from 'mod-arch-shared';
import { agentsCatalogUrl } from '~/app/routes/agentsCatalog/agentsCatalog';

const AgentDetailsPage: React.FC = () => {
  const { agentName: rawAgentName = '' } = useParams<{ agentName: string }>();
  const agentName = decodeURIComponent(rawAgentName);

  return (
    <ApplicationsPage
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={agentsCatalogUrl()}>Agents Catalog</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive data-testid="breadcrumb-agent-name">
            {agentName || 'Details'}
          </BreadcrumbItem>
        </Breadcrumb>
      }
      title={agentName}
      empty={false}
      loaded
      provideChildrenPadding
    >
      Agent details coming soon
    </ApplicationsPage>
  );
};

export default AgentDetailsPage;
