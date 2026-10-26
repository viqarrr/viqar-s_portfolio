import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import ProjectForm from './ProjectForm';
import { Button } from './ui/Button';
import type { Project } from '../../lib/schemas';

interface ProjectsManagerProps {
  initialProjects: Array<Project & { id: string }>;
}

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [items, setItems] = useState<Array<Project & { id: string }>>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<(Project & { id: string }) | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SortableItem) => {
    setEditingProject(item as Project & { id: string });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Projects</h2>
          <p className="text-sm text-slate-400 mt-1">
            Reorder projects by dragging handles. Toggle status or click Edit to update details.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          + Add Project
        </Button>
      </div>

      <SortableList
        items={items}
        collection="projects"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderContent={(item) => (
          <div className="flex items-center gap-3">
            {item.image_src && (
              <img
                src={item.image_src}
                alt={item.image_alt || ''}
                className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                  /{item.slug}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{item.tag}</p>
            </div>
          </div>
        )}
      />

      <ProjectForm
        isOpen={modalOpen}
        project={editingProject}
        onClose={() => setModalOpen(false)}
        onSaved={fetchLatest}
      />
    </div>
  );
}
