export const agentsCatalogUrl = (sourceId?: string): string =>
  `/agents-catalog${sourceId ? `/${sourceId}` : ''}`;

export const getAgentsCatalogDetailsRoute = ({
  sourceId = '',
  agentName,
}: {
  sourceId?: string;
  agentName: string;
}): string => `${agentsCatalogUrl(sourceId)}/${encodeURIComponent(agentName)}`;
