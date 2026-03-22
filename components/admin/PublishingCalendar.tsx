import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getSermons, getEvents, getMinistries, getPastors } from '../../services/contentService';

interface ScheduledItem {
  type: 'sermon' | 'event' | 'ministry' | 'pastor';
  title: string;
  scheduledPublishAt: string;
}

export const PublishingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadScheduledItems = async () => {
      setLoading(true);
      try {
        const [sermons, events, ministries, pastors] = await Promise.all([
          getSermons(),
          getEvents(),
          getMinistries(),
          getPastors(),
        ]);

        const items: ScheduledItem[] = [];

        sermons.forEach((s: any) => {
          if (s.scheduledPublishAt) {
            items.push({
              type: 'sermon',
              title: s.title,
              scheduledPublishAt: s.scheduledPublishAt,
            });
          }
        });

        events.forEach((e: any) => {
          if (e.scheduledPublishAt) {
            items.push({
              type: 'event',
              title: e.title,
              scheduledPublishAt: e.scheduledPublishAt,
            });
          }
        });

        ministries.forEach((m: any) => {
          if (m.scheduledPublishAt) {
            items.push({
              type: 'ministry',
              title: m.name,
              scheduledPublishAt: m.scheduledPublishAt,
            });
          }
        });

        pastors.forEach((p: any) => {
          if (p.scheduledPublishAt) {
            items.push({
              type: 'pastor',
              title: p.name,
              scheduledPublishAt: p.scheduledPublishAt,
            });
          }
        });

        setScheduledItems(items);
      } catch (error) {
        console.error('Failed to load scheduled items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScheduledItems();
  }, []);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

  const getScheduledItemsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledItems.filter((item) => item.scheduledPublishAt.startsWith(dateStr));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sermon':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'event':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'ministry':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
      case 'pastor':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  const selectedDateItems = selectedDate
    ? scheduledItems.filter((item) => item.scheduledPublishAt.startsWith(selectedDate))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-400">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} />
              {monthName} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const items = getScheduledItemsForDate(day);
              const isToday = isCurrentMonth && today.getDate() === day;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square rounded-lg border p-2 text-xs flex flex-col items-center justify-center transition-all hover:border-[#4fb7b3] ${
                    isSelected
                      ? 'border-[#4fb7b3] bg-[#4fb7b3]/10'
                      : 'border-white/10 bg-slate-900/50 hover:bg-slate-900'
                  } ${isToday ? 'ring-2 ring-[#4fb7b3]' : ''}`}
                >
                  <span className={`font-semibold ${isToday ? 'text-[#4fb7b3]' : 'text-white'}`}>{day}</span>
                  {items.length > 0 && (
                    <span className="text-[10px] text-slate-400 mt-1">{items.length} item{items.length > 1 ? 's' : ''}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500/60" />
              <span className="text-slate-400">Sermons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/60" />
              <span className="text-slate-400">Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/60" />
              <span className="text-slate-400">Ministries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500/60" />
              <span className="text-slate-400">Pastors</span>
            </div>
          </div>
        </div>

        {/* Scheduled Items for Selected Date */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4">
            {selectedDate ? `Scheduled for ${selectedDate}` : 'Select a date'}
          </h3>
          <div className="space-y-2">
            {selectedDateItems.length === 0 ? (
              <p className="text-sm text-slate-400">
                {selectedDate ? 'No items scheduled for this date' : 'Click a date to view scheduled items'}
              </p>
            ) : (
              selectedDateItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-3 text-sm ${getTypeColor(item.type)}`}
                >
                  <p className="font-semibold capitalize">{item.type}</p>
                  <p className="text-xs mt-1 line-clamp-2">{item.title}</p>
                  <p className="text-xs mt-2 opacity-75">
                    {new Date(item.scheduledPublishAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Scheduled Items */}
      {scheduledItems.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4">📅 Upcoming Scheduled Publishes</h3>
          <div className="space-y-2">
            {scheduledItems
              .sort((a, b) => new Date(a.scheduledPublishAt).getTime() - new Date(b.scheduledPublishAt).getTime())
              .slice(0, 10)
              .map((item, idx) => {
                const publishDate = new Date(item.scheduledPublishAt);
                const isUpcoming = publishDate > today;

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 flex items-center justify-between ${
                      isUpcoming
                        ? 'border-[#4fb7b3]/30 bg-[#4fb7b3]/10'
                        : 'border-white/10 bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold capitalize">{item.type}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.title}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-semibold">
                        {publishDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-400">
                        {publishDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {scheduledItems.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-slate-400">No scheduled publishes yet</p>
          <p className="text-sm text-slate-500 mt-2">Schedule content from the edit modals to see items here</p>
        </div>
      )}
    </div>
  );
};

export default PublishingCalendar;
