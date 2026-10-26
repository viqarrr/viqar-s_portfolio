import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import CredentialForm from './CredentialForm';
import { Button } from './ui/Button';
import type { Credential } from '../../lib/schemas';

interface CredentialsManagerProps {
  initialCredentials: Array<Credential & { id: string }>;
}

export default function CredentialsManager({ initialCredentials }: CredentialsManagerProps) {
  const [items, setItems] = useState<Array<Credential & { id: string }>>(initialCredentials);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState<(Credential & { id: string }) | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/admin/credentials');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch credentials', err);
    }
  };

  const handleCreate = () => {
    setEditingCred(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SortableItem) => {
    setEditingCred(item as Credential & { id: string });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;
    try {
      const res = await fetch(`/api/admin/credentials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Credentials & Honours</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage honors, certifications, and awards presented on the deck.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          + Add Credential
        </Button>
      </div>

      <SortableList
        items={items}
        collection="credentials"
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
                <span className="text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                  {item.award} ({item.year})
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{item.issuer}</p>
            </div>
          </div>
        )}
      />

      <CredentialForm
        isOpen={modalOpen}
        credential={editingCred}
        onClose={() => setModalOpen(false)}
        onSaved={fetchLatest}
      />
    </div>
  );
}
