import React from 'react';
import { CalendarCheck, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export type AdminSection = 'appointments' | 'posts';

interface AdminSidebarProps {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const NAV_ITEMS: { id: AdminSection; label: string; icon: typeof CalendarCheck }[] = [
  { id: 'appointments', label: '預約紀錄', icon: CalendarCheck },
  { id: 'posts', label: '管理文章', icon: FileText },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  active,
  onSelect,
  collapsed,
  onToggleCollapsed,
}) => {
  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-slate-50/50 py-4 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#023047] text-white'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-[#023047]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 px-3 pt-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          title={collapsed ? '展開側邊欄' : '收合側邊欄'}
          className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-[#023047] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span>收合側邊欄</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
