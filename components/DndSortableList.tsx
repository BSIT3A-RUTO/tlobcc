import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { EventRecord, SermonRecord, MinistryRecord, PastorRecord } from '../types';

interface DndItemProps {
  id: string;
  children: React.ReactNode;
  index: number;
  onDelete: (id: string) => void;
}

const SortableItem = ({ id, children, index, onDelete }: DndItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-item cursor-grab active:cursor-grabbing rounded-xl border border-white/10 p-3 bg-slate-900/60 hover:border-[#4fb7b3]/60 transition-all"
    >
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="drag-handle text-slate-400 hover:text-white cursor-grab active:cursor-grabbing p-1"
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </div>
          <div className="flex-1">{children}</div>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-300 p-1 -m-1 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

interface DndSortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (reorderedItems: T[]) => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  addItem: () => void;
  onDelete: (id: string) => void;
  className?: string;
  title?: string;
  addButtonLabel?: string;
  showAddButton?: boolean;
}

export const DndSortableList = <T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  addItem,
  onDelete,
  className = '',
  title,
  addButtonLabel = '+ Add',
  showAddButton = true
}: DndSortableListProps<T>) => {
  const [localItems, setLocalItems] = useState(items);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
        return newItems;
      });
    }

    setIsDragging(false);
  }, [onReorder]);

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      {showAddButton && (
        <div className="flex gap-2 mb-4">
          <button onClick={addItem} className="rounded-md bg-blue-500 hover:bg-blue-600 px-3 py-2 text-sm font-semibold transition-colors">
            {addButtonLabel}
          </button>
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={localItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {localItems.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                index={index}
                onDelete={onDelete}
              >
                {renderItem(item, index)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {isDragging && <div className="fixed inset-0 z-50 bg-black/50" />}
    </div>
  );
};

