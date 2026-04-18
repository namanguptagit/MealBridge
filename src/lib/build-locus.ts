// ═══════════════════════════════════════════════════════
// MealBridge — BuildWithLocus API Client
// Manages projects, services, deployments, addons,
// and domains on the Locus PaaS platform
// ═══════════════════════════════════════════════════════

import { BUILD_LOCUS_ENDPOINTS } from './constants';

// ─── Types ───────────────────────────────────────────

export interface AuthToken {
  token: string;
  expiresIn: string;
}

export interface BillingBalance {
  creditBalance: number;
  totalServices: number;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Environment {
  id: string;
  name: string;
  type: string;
}

export interface Service {
  id: string;
  name: string;
  url: string;
  projectId: string;
  status?: string;
  runtime_instances?: {
    runningCount: number;
    desiredCount: number;
    pendingCount: number;
  };
}

export interface Deployment {
  id: string;
  serviceId: string;
  status: 'queued' | 'building' | 'deploying' | 'healthy' | 'failed' | 'cancelled' | 'rolled_back';
  durationMs?: number;
  lastLogs?: string[];
  metadata?: {
    phaseTimestamps?: Record<string, string>;
  };
}

export interface FromRepoRequest {
  name: string;
  repo: string;
  branch: string;
}

export interface CreateServiceRequest {
  projectId: string;
  environmentId: string;
  name: string;
  source: {
    type: 'github' | 'image' | 's3';
    repo?: string;
    branch?: string;
    imageUri?: string;
  };
  runtime?: {
    port?: number;
    cpu?: number;
    memory?: number;
    minInstances?: number;
    maxInstances?: number;
  };
  buildConfig?: {
    method?: string;
    dockerfile?: string;
    buildArgs?: Record<string, string>;
  };
  startCommand?: string;
  healthCheckPath?: string;
  autoDeploy?: boolean;
}

// ─── Client Class ────────────────────────────────────

export class BuildLocusClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.text().catch(() => 'Unknown error');
      throw new Error(`BuildWithLocus API error (${res.status}): ${error}`);
    }

    return res.json();
  }

  // ─── Authentication ────────────────────────────────

  /**
   * Exchange a claw_ API key for a JWT bearer token
   * This is the FIRST step before any Build API call
   */
  static async exchangeToken(apiKey: string): Promise<AuthToken> {
    const res = await fetch(BUILD_LOCUS_ENDPOINTS.authExchange, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });

    if (!res.ok) {
      const error = await res.text().catch(() => 'Unknown error');
      throw new Error(`Token exchange failed (${res.status}): ${error}`);
    }

    return res.json();
  }

  // ─── Billing ───────────────────────────────────────

  /**
   * Check credit balance before deploying
   */
  async getBillingBalance(): Promise<BillingBalance> {
    return this.request<BillingBalance>(BUILD_LOCUS_ENDPOINTS.billingBalance);
  }

  // ─── Projects ──────────────────────────────────────

  /**
   * List all projects
   */
  async listProjects(): Promise<Project[]> {
    return this.request<Project[]>(BUILD_LOCUS_ENDPOINTS.projects);
  }

  /**
   * Create a project from a GitHub repo (recommended — one call does everything)
   */
  async createProjectFromRepo(req: FromRepoRequest): Promise<{
    project: Project;
    services: Service[];
    deployments: Deployment[];
  }> {
    return this.request(BUILD_LOCUS_ENDPOINTS.projectsFromRepo, {
      method: 'POST',
      body: JSON.stringify(req),
    });
  }

  /**
   * Create a project manually
   */
  async createProject(
    name: string,
    description?: string
  ): Promise<Project> {
    return this.request<Project>(BUILD_LOCUS_ENDPOINTS.projects, {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  /**
   * Create an environment for a project
   */
  async createEnvironment(
    projectId: string,
    name: string,
    type: string = 'production'
  ): Promise<Environment> {
    return this.request<Environment>(
      BUILD_LOCUS_ENDPOINTS.projectEnvironments(projectId),
      {
        method: 'POST',
        body: JSON.stringify({ name, type }),
      }
    );
  }

  // ─── Services ──────────────────────────────────────

  /**
   * Create a service within a project
   */
  async createService(req: CreateServiceRequest): Promise<Service> {
    return this.request<Service>(BUILD_LOCUS_ENDPOINTS.services, {
      method: 'POST',
      body: JSON.stringify(req),
    });
  }

  /**
   * Get a service with runtime status
   */
  async getServiceWithRuntime(serviceId: string): Promise<Service> {
    return this.request<Service>(
      BUILD_LOCUS_ENDPOINTS.serviceWithRuntime(serviceId)
    );
  }

  // ─── Deployments ───────────────────────────────────

  /**
   * Trigger a new deployment for a service
   */
  async triggerDeployment(serviceId: string): Promise<Deployment> {
    return this.request<Deployment>(BUILD_LOCUS_ENDPOINTS.deployments, {
      method: 'POST',
      body: JSON.stringify({ serviceId }),
    });
  }

  /**
   * Get deployment status
   */
  async getDeployment(deploymentId: string): Promise<Deployment> {
    return this.request<Deployment>(
      BUILD_LOCUS_ENDPOINTS.deployment(deploymentId)
    );
  }

  /**
   * Poll deployment until terminal state
   */
  async pollDeployment(
    deploymentId: string,
    maxAttempts = 60,
    intervalMs = 5000
  ): Promise<Deployment> {
    let attempts = 0;
    const terminalStates = ['healthy', 'failed', 'cancelled', 'rolled_back'];

    while (attempts < maxAttempts) {
      const deployment = await this.getDeployment(deploymentId);

      if (terminalStates.includes(deployment.status)) {
        return deployment;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(
      `Deployment ${deploymentId} did not reach terminal state after ${maxAttempts} attempts`
    );
  }

  // ─── Variables ─────────────────────────────────────

  /**
   * Set environment variables for a service
   */
  async setVariables(
    serviceId: string,
    variables: Record<string, string>
  ): Promise<void> {
    await this.request(BUILD_LOCUS_ENDPOINTS.variables(serviceId), {
      method: 'PUT',
      body: JSON.stringify(variables),
    });
  }

  // ─── Git ───────────────────────────────────────────

  /**
   * Get git remote URL for push deploys
   */
  async getGitRemoteUrl(): Promise<{ remoteUrl: string; usage: string }> {
    return this.request(BUILD_LOCUS_ENDPOINTS.gitRemoteUrl);
  }
}
