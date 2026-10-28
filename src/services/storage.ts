import { SavedProject } from '../types/simulation';

const STORAGE_KEY_PROJECTS = 'whatif_city_saved_projects';

export function getLocalProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveLocalProject(
  projectData: Omit<SavedProject, 'id' | 'createdAt' | 'updatedAt'>
): SavedProject {
  const current = getLocalProjects();
  const id = 'proj_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const newProject: SavedProject = {
    ...projectData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  current.unshift(newProject);
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
  return newProject;
}

export function removeLocalProject(id: string): boolean {
  let current = getLocalProjects();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}
