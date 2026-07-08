/* eslint-disable camelcase */
import type { Agent, AgentList } from '~/app/agentsCatalogTypes';
import type { AgentsCatalogFilterOptionsList } from '~/app/pages/agentsCatalog/types/agentsCatalogFilterOptions';

export const mockAgent = (partial?: Partial<Agent>): Agent => ({
  id: '1',
  name: 'research-assistant',
  displayName: 'Research Assistant',
  description: 'An agent that performs research tasks using web search and summarization.',
  framework: 'LangGraph',
  source_id: 'sample',
  labels: ['research', 'summarization'],
  logo: undefined,
  repositoryUrl: 'https://github.com/example/research-assistant',
  env: [{ name: 'OPENAI_API_KEY', required: true, description: 'API key for the LLM provider' }],
  artifacts: [{ uri: 'ghcr.io/example/research-assistant:latest' }],
  readme: '# Research Assistant\n\n### Overview\n\nAn agent for automated research.',
  ...partial,
});

export const mockAgentList = (partial?: Partial<AgentList>): AgentList => ({
  items: [mockAgent()],
  pageSize: 10,
  size: 1,
  nextPageToken: '',
  ...partial,
});

export const mockAgents: Agent[] = [
  mockAgent(),
  mockAgent({
    id: '2',
    name: 'code-reviewer',
    displayName: 'Code Reviewer',
    description: 'Automated code review agent using static analysis and LLMs.',
    framework: 'CrewAI',
    source_id: 'sample',
    labels: ['code-review', 'automation'],
    repositoryUrl: 'https://github.com/example/code-reviewer',
    artifacts: [{ uri: 'ghcr.io/example/code-reviewer:latest' }],
  }),
  mockAgent({
    id: '3',
    name: 'data-pipeline-agent',
    displayName: 'Data Pipeline Agent',
    description: 'An agent that orchestrates data pipeline tasks.',
    framework: 'LangGraph',
    source_id: 'sample',
    labels: ['data', 'pipeline'],
    readme: undefined,
  }),
];

export const mockAgentsCatalogFilterOptions = (
  partial?: Partial<AgentsCatalogFilterOptionsList>,
): AgentsCatalogFilterOptionsList => ({
  filters: {
    framework: { type: 'string', values: ['LangGraph', 'CrewAI', 'AutoGen'] },
    labels: {
      type: 'string',
      values: ['research', 'code-review', 'data', 'automation', 'summarization'],
    },
  },
  ...partial,
});
