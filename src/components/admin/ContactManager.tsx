import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import ContactForm from './ContactForm';
import { Button } from './ui/Button';
import type { ContactLink } from '../../lib/schemas';

interface ContactManagerProps {
  initialLinks: Array<ContactLink & { id: string }>;
}

export default function ContactManager({ initialLinks }: ContactManagerProps) {
  const [items, setItems] = useState<Array<ContactLink & { id: string }>>(initialLinks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<(ContactLink & { id: string }) | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/admin/contact');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch contact links', err);
    }
  };

  const handleCreate = () => {
    setEditingLink(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SortableItem) => {
    setEditingLink(item as ContactLink & { id: string });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact link?')) return;
    try {
      const res = await fetch(`/api/admin/contact?id=${id}`, { method: 'DELETE' });
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
          <h2 className="text-xl font-bold text-white tracking-tight">Contact & Social Links</h2>
          <p className="text-sm text-slate-400 mt-1">
            Direct channels, social profiles, email targets, and footer links.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          + Add Contact Link
        </Button>
      </div>

      <SortableList
        items={items}
        collection="contact_links"
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderContent={(item) => (
          <div className="flex items-center gap-3">
            {item.icon_svg && (
              <div
                className="w-8 h-8 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: item.icon_svg }}
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white truncate">{item.label}</h4>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-400 truncate"
                >
                  {item.href}
                </a>
              </div>
              {item.description && (
                <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        )}
      />

      <ContactForm
        isOpen={modalOpen}
        contactLink={editingLink}
        onClose={() => setModalOpen(false)}
        onSaved={fetchLatest}
      />
    </div>
  );
}
