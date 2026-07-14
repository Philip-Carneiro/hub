/* eslint-disable camelcase */
import type { Agent, AgentList } from '~/app/agentsCatalogTypes';
import type { AgentsCatalogFilterOptionsList } from '~/app/pages/agentsCatalog/types/agentsCatalogFilterOptions';

export const mockAgent = (partial?: Partial<Agent>): Agent => ({
  id: '1',
  name: 'research-assistant',
  displayName: 'Research Assistant',
  description: 'An agent that performs research tasks using web search and summarization.',
  framework: 'LangGraph',
  source_id: 'agent-templates-source',
  labels: ['Web search', 'General purpose'],
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

export const mockAgentsCatalogFilterOptions = (
  partial?: Partial<AgentsCatalogFilterOptionsList>,
): AgentsCatalogFilterOptionsList => ({
  filters: {
    communicationProtocol: {
      type: 'string',
      values: ['A2A', 'Custom', 'MCP'],
    },
    framework: {
      type: 'string',
      values: ['A2A', 'Autogen', 'Claude Code', 'CrewAI', 'Google ADK', 'LangGraph'],
    },
    testedModels: {
      type: 'string',
      values: [
        'Anthropic-compatible endpoint',
        'Configurable',
        'OpenAI-compatible endpoint',
        'granite-3.1-8b-instruct',
      ],
    },
  },
  ...partial,
});
