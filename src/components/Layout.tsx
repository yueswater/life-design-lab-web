import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavTab, Metric } from '../types';
import { initialLabMetrics } from '../data/labMetricsData';
import { Navbar } from './Navbar';
import { Modals } from './Modals';
import { SiteFooter } from './SiteFooter';
import { CookieConsentBanner } from './CookieConsentBanner';
import { CheckCircle } from 'lucide-react';

export interface LayoutContext {
  showToast: (msg: string) => void;
  openTryFree: () => void;
  setNavLight: (light: boolean) => void;
}

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavTab>('modules');
  const [navLight, setNavLight] = useState(false);

  // A page opts into the light navbar (e.g. an article with a cover image
  // behind it); reset on every route change so it never leaks to the next page.
  useEffect(() => {
    setNavLight(false);
  }, [location.pathname]);
  const [metrics, setMetrics] = useState<Metric[]>(initialLabMetrics);
  const [selectedMetricId, setSelectedMetricId] = useState<string>('ai-churn-risk');

  // Modals state
  const [showNewMetricModal, setShowNewMetricModal] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastUnmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastHideTimer.current) clearTimeout(toastHideTimer.current);
    if (toastUnmountTimer.current) clearTimeout(toastUnmountTimer.current);
    setToastMessage(msg);
    toastHideTimer.current = setTimeout(() => {
      setToastVisible(false);
      toastUnmountTimer.current = setTimeout(() => setToastMessage(null), 300);
    }, 3000);
  };

  // Flip to visible on the frame after mount so the enter transition can play
  useEffect(() => {
    if (!toastMessage) return;
    const raf = requestAnimationFrame(() => setToastVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [toastMessage]);

  const handleCreateMetric = (newMetric: Metric) => {
    setMetrics((prev) => [...prev, newMetric]);
    setSelectedMetricId(newMetric.id);
    showToast(`已成功建立指標： "${newMetric.title}"`);
  };

  const handleTabNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'about') {
      navigate('/about');
      return;
    }
    if (tab === 'articles') {
      navigate('/articles');
      return;
    }
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: tab } });
      return;
    }
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 bg-[#023047] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 ease-out motion-reduce:transition-none ${
            toastVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabNavigate={handleTabNavigate}
        onTryFree={() => navigate('/book')}
        light={navLight}
      />

      {/* Routed Page Content — flex-1 so short pages still push the footer
          flush to the bottom instead of leaving dead space below it */}
      <div className="flex-1">
        <Outlet
          context={
            { showToast, openTryFree: () => navigate('/book'), setNavLight } satisfies LayoutContext
          }
        />
      </div>

      <SiteFooter />
      <CookieConsentBanner />

      {/* Interactive Global Modals */}
      <Modals
        showNewMetricModal={showNewMetricModal}
        onCloseNewMetricModal={() => setShowNewMetricModal(false)}
        onCreateMetric={handleCreateMetric}
      />
    </div>
  );
};
