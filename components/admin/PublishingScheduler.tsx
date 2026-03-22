import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface PublishingSchedulerProps {
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  onPublish: (state: 'draft' | 'now' | 'scheduled', scheduledDate?: string) => void;
}

export const PublishingScheduler: React.FC<PublishingSchedulerProps> = ({
  published = true,
  publishedAt,
  scheduledPublishAt,
  onPublish,
}) => {
  const [mode, setMode] = useState<'draft' | 'now' | 'scheduled'>(
    scheduledPublishAt ? 'scheduled' : published ? 'now' : 'draft'
  );
  const [scheduledDate, setScheduledDate] = useState(
    scheduledPublishAt ? scheduledPublishAt.split('T')[0] : ''
  );
  const [scheduledTime, setScheduledTime] = useState(
    scheduledPublishAt ? scheduledPublishAt.split('T')[1]?.slice(0, 5) || '09:00' : '09:00'
  );

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'draft' | 'now' | 'scheduled');
    if (newMode === 'scheduled') {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime('09:00');
    }
  };

  const handleSchedule = () => {
    if (mode === 'scheduled' && scheduledDate && scheduledTime) {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;
      onPublish('scheduled', scheduledDateTime);
    } else {
      onPublish(mode);
    }
  };

  const getStatusLabel = () => {
    if (mode === 'draft') return 'Draft - Not visible to public';
    if (mode === 'scheduled')
      return `Scheduled for ${scheduledDate} at ${scheduledTime}`;
    if (published && publishedAt) {
      return `Published on ${new Date(publishedAt).toLocaleDateString()}`;
    }
    return 'Published - Visible to public';
  };

  return (
    <div className="space-y-3">
      <label className="text-xs uppercase text-slate-400 font-semibold">Publishing Status</label>

      {/* Mode Options */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleModeChange('draft')}
          className={`p-3 rounded-lg border text-center text-sm font-medium transition-all ${
            mode === 'draft'
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
              : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          <div className="text-xs">Draft</div>
          <div className="text-lg">📝</div>
        </button>
        <button
          onClick={() => handleModeChange('now')}
          className={`p-3 rounded-lg border text-center text-sm font-medium transition-all ${
            mode === 'now'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          <div className="text-xs">Publish Now</div>
          <div className="text-lg">✓</div>
        </button>
        <button
          onClick={() => handleModeChange('scheduled')}
          className={`p-3 rounded-lg border text-center text-sm font-medium transition-all ${
            mode === 'scheduled'
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
              : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          <div className="text-xs">Schedule</div>
          <div className="text-lg">🕐</div>
        </button>
      </div>

      {/* Scheduled DateTime Picker */}
      {mode === 'scheduled' && (
        <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-white/10">
          <label className="text-xs uppercase text-slate-400 font-semibold">
            Schedule for
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-white/10 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-white/10 text-white text-sm"
              />
            </div>
          </div>
          {scheduledDate && (
            <p className="text-xs text-slate-400 pt-2">
              📅 Will publish on {new Date(scheduledDate).toLocaleDateString()} at {scheduledTime}
            </p>
          )}
        </div>
      )}

      {/* Status Display */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-slate-400 mb-1">Status</p>
        <p className="text-sm font-semibold text-slate-200">{getStatusLabel()}</p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSchedule}
        className="w-full px-4 py-2 rounded-lg bg-[#4fb7b3] text-black font-semibold hover:bg-[#4fb7b3]/90 transition-colors text-sm"
      >
        {mode === 'scheduled' ? 'Schedule' : mode === 'draft' ? 'Save as Draft' : 'Publish Now'}
      </button>
    </div>
  );
};
