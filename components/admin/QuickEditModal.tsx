import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { CollapsibleFormSection } from './CollapsibleFormSection';
import { PublishingScheduler } from './PublishingScheduler';
import { ImageUploadField } from './ImageUploadField';

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  itemType: 'sermon' | 'event' | 'ministry' | 'pastor' | 'testimonial';
  onSave: (item: any, publishState?: 'draft' | 'now' | 'scheduled', scheduledDate?: string) => Promise<void>;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  onSave,
}) => {
  const [formData, setFormData] = useState(item || {});
  const [isSaving, setIsSaving] = useState(false);
  const [publishState, setPublishState] = useState<'draft' | 'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState<string>();

  // Update form data when item changes
  React.useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData, publishState, scheduledDate);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
            <h2 className="text-lg font-bold text-white">
              Edit {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Basic Info */}
            <CollapsibleFormSection title="Basic Information" defaultOpen>
              {itemType !== 'testimonial' && (
                <div>
                  <label className="text-xs uppercase text-slate-400 font-semibold">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                  />
                </div>
              )}

              {itemType === 'testimonial' && (
                <div>
                  <label className="text-xs uppercase text-slate-400 font-semibold">Quote</label>
                  <textarea
                    value={formData.quote || ''}
                    onChange={(e) => handleChange('quote', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm h-24"
                  />
                </div>
              )}

              {itemType === 'testimonial' && (
                <div>
                  <label className="text-xs uppercase text-slate-400 font-semibold">Author</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => handleChange('author', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                  />
                </div>
              )}

              {itemType === 'event' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Date</label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Time</label>
                      <input
                        type="time"
                        value={formData.time || ''}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm h-20"
                    />
                  </div>
                </>
              )}

              {itemType === 'sermon' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Series</label>
                      <input
                        type="text"
                        value={formData.series || ''}
                        onChange={(e) => handleChange('series', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Speaker</label>
                      <input
                        type="text"
                        value={formData.speaker || ''}
                        onChange={(e) => handleChange('speaker', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Video ID</label>
                    <input
                      type="text"
                      value={formData.videoId || ''}
                      onChange={(e) => handleChange('videoId', e.target.value)}
                      placeholder="YouTube video ID"
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {itemType === 'ministry' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Category</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-slate-400 font-semibold">Day</label>
                      <input
                        type="text"
                        value={formData.day || ''}
                        onChange={(e) => handleChange('day', e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm h-20"
                    />
                  </div>
                </>
              )}

              {itemType === 'pastor' && (
                <>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-slate-400 font-semibold">Role</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                    />
                  </div>
                </>
              )}
            </CollapsibleFormSection>

            {/* Media */}
            {(itemType !== 'testimonial' || itemType === 'pastor') && (
              <CollapsibleFormSection title="Media">
                <ImageUploadField
                  value={formData.image || ''}
                  onChange={(url) => handleChange('image', url)}
                  folder={itemType === 'sermon' ? 'sermons' : itemType === 'event' ? 'events' : itemType === 'ministry' ? 'ministries' : 'pastors'}
                />
              </CollapsibleFormSection>
            )}

            {/* Publishing */}
            <CollapsibleFormSection title="Publishing">
              <PublishingScheduler
                published={formData.published !== false}
                publishedAt={formData.publishedAt}
                scheduledPublishAt={formData.scheduledPublishAt}
                onPublish={(state, date) => {
                  setPublishState(state);
                  setScheduledDate(date);
                }}
              />
            </CollapsibleFormSection>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 bg-slate-900/50 p-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 rounded-lg bg-[#4fb7b3] text-black font-semibold hover:bg-[#4fb7b3]/90 disabled:opacity-50 disabled:cursor-not-allowed flex  items-center justify-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
