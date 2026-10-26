import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import SkillForm from './SkillForm';
import { Button } from './ui/Button';
import type { Skill } from '../../lib/schemas';

interface SkillsManagerProps {
  initialSkills: Array<Skill & { id: string }>;
}

export default function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [items, setItems] = useState<Array<Skill & { id: string }>>(initialSkills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<(Skill & { id: string }) | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SortableItem) => {
    setEditingSkill(item as Skill & { id: string });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Skills & Tools</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage interactive skill radar nodes, categorized badges, and SVG logos.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          + Add Skill
        </Button>
      </div>

      <SortableList
        items={items}
        collection="skills"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderContent={(item) => (
          <div className="flex items-center gap-3">
            {item.logo_svg && (
              <div
                className="w-8 h-8 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: item.logo_svg }}
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        )}
      />

      <SkillForm
        isOpen={modalOpen}
        skill={editingSkill}
        onClose={() => setModalOpen(false)}
        onSaved={fetchLatest}
      />
    </div>
  );
}
