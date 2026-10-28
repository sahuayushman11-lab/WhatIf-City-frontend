import React, { useState, useEffect } from 'react';
import { SavedProject } from '../types/simulation';
import { apiClient } from '../services/api';
import { Bookmark, Clock, Sliders, GitCompare, Trash2, FolderPlus, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectsPageProps {
  onLoadIntoLab: (scenarioId: string) => void;
  onLoadIntoCompare: (scenarioId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onLoadIntoLab,
  onLoadIntoCompare,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const list = await apiClient.getProjects();
    setProjects(list);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this saved project?')) {
      await apiClient.deleteProject(id);
      loadProjects();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Scenario Project Manager
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-[11px] font-mono text-slate-500">Local &amp; Cloud Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Saved Projects</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revisit previously configured parameter snapshots and comparative scenario studies.
          </p>
        </div>
      </div>

      {/* Guest Mode Persistence Note */}
      <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 mt-0.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
        <div className="space-y-1">
          <span className="font-semibold block">Turnkey Guest Persistence Mode</span>
          <p className="leading-relaxed">
            Your saved projects persist instantly in your browser's local storage and backend memory. When Supabase
            PostgreSQL credentials are added in <code className="font-mono text-[11px] bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded">.env</code>,
            projects automatically sync with multi-user Row Level Security (RLS).
          </p>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs text-slate-400">Loading saved projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Saved Projects Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can save any scenario comparison study directly from the <strong>Compare Scenarios</strong> page using
            the &ldquo;Save Project&rdquo; button.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Project Snapshot
                  </span>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{proj.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{proj.description}</p>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(proj.createdAt).toLocaleDateString()} at {new Date(proj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onLoadIntoLab(proj.scenariosSnapshot.scenarioId)}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Lab</span>
                </button>
                <button
                  onClick={() => onLoadIntoCompare(proj.scenariosSnapshot.scenarioId)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
