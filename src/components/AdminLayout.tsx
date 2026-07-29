import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { adminLogout } from '../lib/admin-api';
import { SiteFooter } from './SiteFooter';

// Minimal chrome for the internal admin tool: just the brand mark (linking
// home) and a logout button — no public nav tabs, language toggle, or CTAs.
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      <header className="w-full px-4 py-3.5 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
        <Outlet />
      </div>

      <SiteFooter />
    </div>
  );
};
