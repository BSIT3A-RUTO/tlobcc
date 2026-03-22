import React, { useState } from 'react';
import {
  LayoutDashboard,
  Music,
  Calendar,
  Users,
  MessageSquare,
  Smile,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import { adminSignOut } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  unreadCount,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    content: true,
    submissions: true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const menuItems = [
    {
      group: 'main',
      label: 'Dashboard',
      icon: LayoutDashboard,
      id: 'overview',
    },
    {
      group: 'content',
      label: 'Content',
      items: [
        { label: 'Sermons', icon: Music, id: 'sermons' },
        { label: 'Events', icon: Calendar, id: 'events' },
        { label: 'Ministries', icon: Users, id: 'ministries' },
        { label: 'Pastors', icon: Smile, id: 'pastors' },
        { label: 'Testimonials', icon: MessageSquare, id: 'testimonials' },
      ],
    },
    {
      group: 'submissions',
      label: 'Submissions',
      items: [
        { label: 'Prayers', icon: Bell, id: 'prayers', badge: unreadCount > 0 ? unreadCount : null },
        { label: 'Pastoral Care', icon: Users, id: 'pastoral-care', badge: unreadCount > 0 ? unreadCount : null },
        { label: 'Connects', icon: MessageSquare, id: 'connects', badge: unreadCount > 0 ? unreadCount : null },
      ],
    },
    {
      group: 'settings',
      label: 'Tools',
      items: [
        { label: 'Site Metadata', icon: Settings, id: 'site' },
        { label: 'Livestream', icon: Calendar, id: 'livestream' },
        { label: 'Analytics', icon: LayoutDashboard, id: 'analytics' },
        { label: 'Publishing Calendar', icon: Calendar, id: 'calendar' },
      ],
    },
  ];

  const handleLogout = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  const handleTabClick = (id: string) => {
    onTabChange(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const isGroupExpanded = (group: string) => expandedGroups[group];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-slate-900/80 backdrop-blur border-r border-white/10 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">TLOBCC Admin</h2>
          <p className="text-xs text-slate-400 mt-1">Content Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            if (item.group === 'main') {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#4fb7b3] text-black font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            }

            const expanded = isGroupExpanded(item.group);
            return (
              <div key={item.group}>
                <button
                  onClick={() => toggleGroup(item.group)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors justify-between"
                >
                  <span>{item.label}</span>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expanded && (
                  <div className="space-y-1 ml-4 mt-1">
                    {item.items?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleTabClick(subItem.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                            activeTab === subItem.id
                              ? 'bg-[#4fb7b3]/20 text-[#4fb7b3] font-semibold'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <SubIcon size={16} />
                          <span className="flex-1 text-left">{subItem.label}</span>
                          {subItem.badge && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {subItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
