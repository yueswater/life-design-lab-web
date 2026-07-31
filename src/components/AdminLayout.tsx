import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { adminLogout } from '../lib/admin-api';
import { SiteFooter } from './SiteFooter';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { AdminArticlesList } from './admin/AdminArticlesList';
import { AdminArticleEditor } from './admin/AdminArticleEditor';

const SECTION_TITLE: Record<AdminSection, string> = {
  appointments: '預約管理',
  posts: '文章管理',
};

const SECTION_STORAGE_KEY = 'ldl-admin-section';
const ARTICLE_STORAGE_KEY = 'ldl-admin-editing-article';

function readStoredSection(): AdminSection {
  const stored = window.localStorage.getItem(SECTION_STORAGE_KEY);
  return stored === 'posts' ? 'posts' : 'appointments';
}

// Minimal chrome for the internal admin tool: sidebar for section switching
// (client-side only, no route change) + a top bar with the brand mark and
// logout — no public nav tabs, language toggle, or CTAs.
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>(readStoredSection);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(() =>
    window.localStorage.getItem(ARTICLE_STORAGE_KEY)
  );

  useEffect(() => {
    document.title = `生命設計實驗室 | ${SECTION_TITLE[section]}`;
    window.localStorage.setItem(SECTION_STORAGE_KEY, section);
  }, [section]);

  useEffect(() => {
    if (editingArticleId) {
      window.localStorage.setItem(ARTICLE_STORAGE_KEY, editingArticleId);
    } else {
      window.localStorage.removeItem(ARTICLE_STORAGE_KEY);
    }
  }, [editingArticleId]);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login', { replace: true });
  };

  const handleSelectSection = (next: AdminSection) => {
    setSection(next);
    setEditingArticleId(null);
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans antialiased">
      <AdminSidebar
        active={section}
        onSelect={handleSelectSection}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex flex-1 flex-col">
        <header className="w-full px-4 py-3.5 sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="生命設計實驗室" className="w-9 h-9 object-contain" />
              <span className="text-lg font-extrabold tracking-tight text-[#023047]">
                生命設計實驗室
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-[#023047] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </div>
        </header>

        <div className="flex-1">
          {section === 'appointments' && <Outlet />}
          {section === 'posts' &&
            (editingArticleId ? (
              <AdminArticleEditor
                articleId={editingArticleId}
                onBack={() => setEditingArticleId(null)}
              />
            ) : (
              <AdminArticlesList onOpenArticle={setEditingArticleId} />
            ))}
        </div>

        <SiteFooter />
      </div>
    </div>
  );
};
