import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { adminLogin } from '../lib/admin-api';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '生命設計實驗室 | 管理登入';
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(username, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('帳號或密碼錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#023047]/50">
          Life Design Lab
        </p>
        <h1 className="font-huninn text-2xl font-black text-[#023047]">管理後台登入</h1>
        <p className="mt-1 text-sm text-slate-500">請輸入帳號密碼以繼續</p>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-xs font-semibold text-slate-700 mb-1.5">
              帳號
            </label>
            <input
              id="admin-username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              密碼
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#023047] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {submitting ? '登入中...' : '登入'}
          </button>
        </div>
      </form>
    </div>
  );
}
