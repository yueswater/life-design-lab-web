import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Menu, X } from 'lucide-react';
import { NavTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';

interface NavbarProps {
  activeTab: NavTab;
  onTabNavigate: (tab: NavTab) => void;
  onTryFree: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabNavigate,
  onTryFree,
}) => {
  const { toggleLanguage } = useLanguage();
  const t = useTranslation();
  const tabs: { id: NavTab; label: string }[] = [
    { id: 'testimonials', label: t.nav.testimonials },
    { id: 'modules', label: t.nav.modules },
    { id: 'about', label: t.nav.about },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu on breakpoint change so it can't get stuck open
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const close = () => setMobileOpen(false);
    mql.addEventListener('change', close);
    return () => mql.removeEventListener('change', close);
  }, []);

  // Lock page scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleMobileTabClick = (tab: NavTab) => {
    setMobileOpen(false);
    onTabNavigate(tab);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full py-3.5 px-4 sm:px-8 transition-[background-color,box-shadow] duration-300 ${
        scrolled || mobileOpen ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 cursor-pointer">
          <img
            src="/logo.svg"
            alt="生命設計實驗室"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
          />
          <span className="flex flex-col justify-center leading-none font-sans">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#023047]">
              生命設計實驗室
            </span>
            <span className="mt-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#023047]/50">
              Life Design Lab
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="flex items-center space-x-7 text-sm font-semibold text-[#023047]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabNavigate(tab.id)}
                className="cursor-pointer text-[#023047] transition-opacity duration-150 hover:opacity-60"
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={onTryFree}
              className="cursor-pointer font-bold text-[#023047] transition-opacity hover:opacity-60"
            >
              {t.nav.tryFree}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black text-[#023047] transition-opacity hover:opacity-60"
            >
              <Languages className="h-3.5 w-3.5" />
              {t.nav.langToggle}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#023047] cursor-pointer lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu: full-screen, blurred backdrop, items stacked top to bottom, dead-centered */}
      {mobileOpen && (
        <nav className="fixed inset-0 z-30 flex flex-col items-stretch justify-center gap-2 overflow-y-auto bg-white/90 px-8 py-[15vh] backdrop-blur-lg lg:hidden">
          <div className="m-auto flex w-full flex-col items-stretch gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMobileTabClick(tab.id)}
                className={`cursor-pointer rounded-xl px-3 py-3.5 text-left text-2xl font-black transition-opacity hover:opacity-60 ${
                  activeTab === tab.id ? 'text-[#023047]' : 'text-[#023047]/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onTryFree();
              }}
              className="cursor-pointer rounded-xl px-3 py-3.5 text-left text-2xl font-black text-[#023047] transition-opacity hover:opacity-60"
            >
              {t.nav.tryFree}
            </button>

            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="mt-4 flex w-fit cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black text-[#023047] transition-opacity hover:opacity-60"
            >
              <Languages className="h-4 w-4" />
              {t.nav.langToggle}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
