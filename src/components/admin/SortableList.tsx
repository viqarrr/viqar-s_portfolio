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
      className={`p-4 md:p-5 bg-[#18171f] hover:bg-[#1f1d26] rounded-2xl transition-all duration-150 shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-4 select-none ${
        isDragging ? 'scale-[1.02] shadow-apple-float bg-[#1f1d26] ring-2 ring-[#6c3cff]' : ''
      }`}
    >
      {/* Left: Drag grip + Content */}
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        {/* Drag Handle (44x44px touch target) */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#aaa7b4] hover:text-white cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Sort Order Display */}
        <span className="hidden sm:inline-block w-8 text-center text-xs font-mono text-[#5d5a67] flex-shrink-0">
          #{item.sort_order}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {renderContent ? (
            renderContent(item)
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-heading font-bold text-base text-white truncate">{displayName}</h4>
                {item.slug && (
                  <span className="text-xs font-mono text-[#aaa7b4] bg-white/[0.05] px-2 py-0.5 rounded-lg">
                    /{item.slug}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right / Bottom on mobile: Controls */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t border-white/[0.04] md:border-t-0 flex-shrink-0">
        <button
          type="button"
          onClick={() =>
            onStatusToggle(item.id, item.status === 'published' ? 'draft' : 'published')
          }
          className="cursor-pointer min-h-[44px] flex items-center active:scale-95 transition-transform"
          title={`Click to switch to ${item.status === 'published' ? 'draft' : 'published'}`}
        >
          <Badge status={item.status} />
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onEdit(item)}
            className="min-h-[44px] px-4"
          >
            Edit
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[44px] px-3"
          >
            Delete
          </Button>
        </div>
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
        <div className="p-4 bg-[#6c3cff]/15 text-white text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[#aaa7b4] hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-12 text-center bg-[#18171f] rounded-3xl text-[#aaa7b4] text-sm">
          No entries found. Click "+ Add New" to create the first record.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
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
