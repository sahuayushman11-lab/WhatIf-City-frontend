import { ScenarioDefinition, SimulationResult, ScenarioComparisonOutput, SavedProject, TrafficSimulationParams } from '../types/simulation';
import { TrafficQueueSimulationEngine } from '../features/simulation/engine/trafficQueue';
import { ScenarioComparisonEngine } from '../features/simulation/engine/comparisonEngine';
import { DEFAULT_CLIENT_SCENARIOS } from './defaultScenarios';
import { getLocalProjects, saveLocalProject, removeLocalProject } from './storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = {
  /**
   * Fetch all scenarios with fallback to default synthetic catalog
   */
  async getScenarios(category?: string, search?: string): Promise<ScenarioDefinition[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/scenarios?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.info('Backend API unavailable, using client-side scenario repository.');
    }

    // Client fallback
    let list = [...DEFAULT_CLIENT_SCENARIOS];
    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return list;
  },

  /**
   * Fetch single scenario by ID
   */
  async getScenarioById(id: string): Promise<ScenarioDefinition | null> {
    try {
      const res = await fetch(`${API_BASE}/scenarios/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_CLIENT_SCENARIOS.find((s) => s.id === id) ?? null;
  },

  /**
   * Run simulation: uses server when reachable, client engine fallback for instant responsiveness
   */
  async runSimulation(
    params: TrafficSimulationParams,
    scenarioName: string = 'Simulation Run',
    scenarioId?: string
  ): Promise<SimulationResult> {
    try {
      const res = await fetch(`${API_BASE}/simulations/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters: params, scenarioName, scenarioId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson?.error) {
          throw new Error(errJson.error);
        }
      }
    } catch (e: any) {
      if (e.message && e.message.includes('Signal timing infeasible')) {
        throw e;
      }
      console.info('Running simulation via client engine...');
    }

    // Direct client engine execution
    return TrafficQueueSimulationEngine.run(params, { scenarioName, scenarioId });
  },

  /**
   * Compare baseline, Plan A, and Plan B
   */
  async compareSimulations(payload: {
    baseline: TrafficSimulationParams;
    planA: TrafficSimulationParams;
    planB: TrafficSimulationParams;
    names?: { baseline?: string; planA?: string; planB?: string };
    objective?: 'minimize_delay' | 'minimize_queue' | 'prioritize_pedestrians' | 'balanced';
  }): Promise<ScenarioComparisonOutput> {
    try {
      const res = await fetch(`${API_BASE}/simulations/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      console.info('Running comparison via client comparison engine...');
    }

    // Client fallback execution
    const baseRes = TrafficQueueSimulationEngine.run(payload.baseline, {
      scenarioName: payload.names?.baseline || 'Baseline Scenario',
    });
    const planARes = TrafficQueueSimulationEngine.run(payload.planA, {
      scenarioName: payload.names?.planA || 'Proposed Plan A',
    });
    const planBRes = TrafficQueueSimulationEngine.run(payload.planB, {
      scenarioName: payload.names?.planB || 'Proposed Plan B',
    });

    return ScenarioComparisonEngine.compare(baseRes, planARes, planBRes, payload.objective || 'balanced');
  },

  /**
   * Projects management
   */
  async getProjects(): Promise<SavedProject[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }
    return getLocalProjects();
  },

  async saveProject(project: Omit<SavedProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedProject> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }
    return saveLocalProject(project);
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      // fallback
    }
    return removeLocalProject(id);
  },
};
