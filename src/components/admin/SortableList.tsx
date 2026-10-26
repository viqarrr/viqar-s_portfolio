import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface SortableItem {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  sort_order: number;
  status: 'draft' | 'published';
  [key: string]: any;
}

interface SortableListProps {
  items: SortableItem[];
  collection: 'projects' | 'skills' | 'credentials' | 'experiences' | 'contact_links';
  onEdit: (item: SortableItem) => void;
  onDelete: (id: string) => void;
  renderContent?: (item: SortableItem) => React.ReactNode;
}

interface SortableRowProps {
  item: SortableItem;
  onEdit: (item: SortableItem) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (id: string, newStatus: 'draft' | 'published') => void;
  renderContent?: (item: SortableItem) => React.ReactNode;
}

function SortableRow({
  item,
  onEdit,
  onDelete,
  onStatusToggle,
  renderContent,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const displayName = item.title || item.name || item.slug || 'Untitled';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 transition-shadow ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-500 bg-slate-850' : 'hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded cursor-grab active:cursor-grabbing flex-shrink-0"
          title="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Sort Order Display */}
        <span className="w-8 text-center text-xs font-mono text-slate-500 flex-shrink-0">
          #{item.sort_order}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {renderContent ? (
            renderContent(item)
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white truncate">{displayName}</h4>
                {item.slug && (
                  <span className="text-xs font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    /{item.slug}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={() =>
            onStatusToggle(item.id, item.status === 'published' ? 'draft' : 'published')
          }
          className="cursor-pointer"
          title={`Click to switch to ${item.status === 'published' ? 'draft' : 'published'}`}
        >
          <Badge status={item.status} />
        </button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onEdit(item)}
        >
          Edit
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function SortableList({
  items: initialItems,
  collection,
  onEdit,
  onDelete,
  renderContent,
}: SortableListProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [feedback, setFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const moved = arrayMove(items, oldIndex, newIndex);
      // Re-index sort_order by 10
      const reindexed = moved.map((item, idx) => ({
        ...item,
        sort_order: (idx + 1) * 10,
      }));

      setItems(reindexed);

      try {
        const payload = {
          collection,
          items: reindexed.map((i) => ({ id: i.id, sort_order: i.sort_order })),
        };

        const res = await fetch('/api/admin/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          setFeedback(`Reorder failed: ${err.error || 'Server error'}`);
        } else {
          setFeedback('Order saved successfully');
          setTimeout(() => setFeedback(null), 3000);
        }
      } catch (err: any) {
        setFeedback(`Reorder network error: ${err.message}`);
      }
    }
  };

  const handleStatusToggle = async (id: string, newStatus: 'draft' | 'published') => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, id, status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        setFeedback(`Status update failed: ${err.error || 'Server error'}`);
        // Revert
        setItems(initialItems);
      } else {
        setFeedback(`Status updated to ${newStatus}`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setFeedback(`Network error: ${err.message}`);
      setItems(initialItems);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-300 text-xs rounded-lg flex items-center justify-between">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-blue-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
          No entries found. Click "+ Add New" to create the first record.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  collection={collection}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusToggle={handleStatusToggle}
                  renderContent={renderContent}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
