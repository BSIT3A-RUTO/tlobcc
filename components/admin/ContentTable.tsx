import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Check, Clock } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  format?: (value: any, item: any) => React.ReactNode;
  width?: string;
}

interface ContentTableProps {
  items: any[];
  columns: Column[];
  onEdit?: (item: any, index: number) => void;
  onDelete?: (id: string, index: number) => void;
  onPreview?: (item: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  items,
  columns,
  onEdit,
  onDelete,
  onPreview,
  loading = false,
  emptyMessage = 'No items found',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getStatusIcon = (item: any) => {
    if (!item.published) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
          <Clock size={12} />
          Draft
        </span>
      );
    }
    if (item.scheduledPublishAt) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <Clock size={12} />
          Scheduled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <Check size={12} />
        Published
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-slate-400">Loading...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-slate-400 text-center">
            <p>{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-slate-900/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs uppercase font-semibold text-slate-400 whitespace-nowrap"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs uppercase font-semibold text-slate-400 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs uppercase font-semibold text-slate-400 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-300"
                      style={{ width: col.width }}
                    >
                      {col.format ? col.format(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {getStatusIcon(item)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onPreview && (
                        <button
                          onClick={() => onPreview(item)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item, index)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this item?')) {
                              onDelete(item.id, index);
                            }
                          }}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
