package repositories

import (
	"context"
	"errors"
	"fmt"
	"sync"

	k8s "github.com/kubeflow/hub/ui/bff/internal/integrations/kubernetes"
	"github.com/kubeflow/hub/ui/bff/internal/models"
)

var (
	ErrMcpCatalogSourceNotFound     = errors.New("mcp catalog source not found")
	ErrMcpCatalogSourceAlreadyExist = errors.New("mcp catalog source already exists")
	ErrMcpCatalogSourceIdRequired   = errors.New("mcp catalog source ID is required")
	ErrMcpCatalogSourceConflict     = errors.New("mcp catalog source was modified by another request")
	ErrMcpCatalogNotImplemented     = errors.New("mcp catalog settings not implemented yet")
)

type McpCatalogSettingsRepository struct {
	mu       sync.Mutex
	catalogs []models.McpCatalogSourceConfig
}

func NewMcpCatalogSettingsRepository() *McpCatalogSettingsRepository {
	enabled := true
	disabled := false
	isDefault := true
	return &McpCatalogSettingsRepository{
		catalogs: []models.McpCatalogSourceConfig{
			{
				Id:        "community-mcp-source",
				Name:      "Community MCP Servers",
				Type:      "yaml",
				Enabled:   &enabled,
				Labels:    []string{"community_mcp_servers"},
				IsDefault: &isDefault,
			},
			{
				Id:              "organization-mcp-source",
				Name:            "Organization MCP Servers",
				Type:            "yaml",
				Enabled:         &enabled,
				Labels:          []string{"organization_mcp_servers"},
				IsDefault:       &isDefault,
				IncludedServers: []string{"github-mcp-server", "slack-mcp-server"},
			},
			{
				Id:        "standalone-mcp-source",
				Name:      "Other MCP Servers",
				Type:      "yaml",
				Enabled:   &enabled,
				Labels:    []string{},
				IsDefault: &isDefault,
			},
			{
				Id:        "disabled-mcp-source",
				Name:      "Disabled MCP source",
				Type:      "yaml",
				Enabled:   &disabled,
				Labels:    []string{"disabled_servers"},
				IsDefault: &isDefault,
			},
			{
				Id:      "user-mcp-source",
				Name:    "User MCP Server",
				Type:    "yaml",
				Enabled: &enabled,
				Labels:  []string{"user"},
			},
		},
	}
}

func (r *McpCatalogSettingsRepository) GetAllMcpCatalogSourceConfigs(_ context.Context, _ k8s.KubernetesClientInterface, _ string) (*models.McpCatalogSourceConfigList, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	result := make([]models.McpCatalogSourceConfig, len(r.catalogs))
	copy(result, r.catalogs)
	return &models.McpCatalogSourceConfigList{Catalogs: result}, nil
}

func (r *McpCatalogSettingsRepository) GetMcpCatalogSourceConfig(_ context.Context, _ k8s.KubernetesClientInterface, _ string, sourceID string) (*models.McpCatalogSourceConfig, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for i := range r.catalogs {
		if r.catalogs[i].Id == sourceID {
			c := r.catalogs[i]
			return &c, nil
		}
	}
	return nil, fmt.Errorf("%w: %s", ErrMcpCatalogSourceNotFound, sourceID)
}

func (r *McpCatalogSettingsRepository) CreateMcpCatalogSourceConfig(_ context.Context, _ k8s.KubernetesClientInterface, _ string, payload models.McpCatalogSourceConfigPayload) (*models.McpCatalogSourceConfig, error) {
	if payload.Id == "" {
		return nil, ErrMcpCatalogSourceIdRequired
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, c := range r.catalogs {
		if c.Id == payload.Id {
			return nil, ErrMcpCatalogSourceAlreadyExist
		}
	}
	enabled := true
	newConfig := models.McpCatalogSourceConfig{
		Id:      payload.Id,
		Name:    payload.Name,
		Type:    payload.Type,
		Enabled: &enabled,
		Labels:  payload.Labels,
	}
	r.catalogs = append(r.catalogs, newConfig)
	return &newConfig, nil
}

func (r *McpCatalogSettingsRepository) UpdateMcpCatalogSourceConfig(_ context.Context, _ k8s.KubernetesClientInterface, _ string, sourceID string, payload models.McpCatalogSourceConfigPayload) (*models.McpCatalogSourceConfig, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for i := range r.catalogs {
		if r.catalogs[i].Id == sourceID {
			if payload.Enabled != nil {
				r.catalogs[i].Enabled = payload.Enabled
			}
			if payload.Name != "" {
				r.catalogs[i].Name = payload.Name
			}
			if payload.IncludedServers != nil {
				r.catalogs[i].IncludedServers = payload.IncludedServers
			}
			if payload.ExcludedServers != nil {
				r.catalogs[i].ExcludedServers = payload.ExcludedServers
			}
			c := r.catalogs[i]
			return &c, nil
		}
	}
	return nil, fmt.Errorf("%w: %s", ErrMcpCatalogSourceNotFound, sourceID)
}

func (r *McpCatalogSettingsRepository) DeleteMcpCatalogSourceConfig(_ context.Context, _ k8s.KubernetesClientInterface, _ string, sourceID string) (*models.McpCatalogSourceConfig, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for i := range r.catalogs {
		if r.catalogs[i].Id == sourceID {
			deleted := r.catalogs[i]
			r.catalogs = append(r.catalogs[:i], r.catalogs[i+1:]...)
			return &deleted, nil
		}
	}
	return nil, fmt.Errorf("%w: %s", ErrMcpCatalogSourceNotFound, sourceID)
}
