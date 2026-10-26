import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import ExperienceForm from './ExperienceForm';
import { Button } from './ui/Button';
import type { Experience } from '../../lib/schemas';

interface ExperiencesManagerProps {
  initialExperiences: Array<Experience & { id: string }>;
}

export default function ExperiencesManager({ initialExperiences }: ExperiencesManagerProps) {
  const [items, setItems] = useState<Array<Experience & { id: string }>>(initialExperiences);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<(Experience & { id: string }) | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/admin/experiences');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch experiences', err);
    }
  };

  const handleCreate = () => {
    setEditingExp(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SortableItem) => {
    setEditingExp(item as Experience & { id: string });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Work Experiences</h2>
          <p className="text-sm text-slate-400 mt-1">
            Chronological career history, roles, responsibilities, and key technologies.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          + Add Experience
        </Button>
      </div>

      <SortableList
        items={items}
        collection="experiences"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderContent={(item) => (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
              <span className="text-xs text-blue-400 font-medium">@ {item.org}</span>
              <span className="text-xs text-slate-500">({item.period})</span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
          </div>
        )}
      />

      <ExperienceForm
        isOpen={modalOpen}
        experience={editingExp}
        onClose={() => setModalOpen(false)}
        onSaved={fetchLatest}
      />
    </div>
  );
}
