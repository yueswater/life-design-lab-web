import { useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { ModuleItem } from '../types';
import { modulesData } from '../data/modulesData';
import { HeroSection } from '../components/HeroSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { LatestArticlesSection } from '../components/LatestArticlesSection';
import { Module3DCarousel } from '../components/Module3DCarousel';
import { ModuleDetailModal } from '../components/ModuleDetailModal';
import type { LayoutContext } from '../components/Layout';
import { useTranslation } from '../i18n/strings';

export default function HomePage() {
  const { showToast, openTryFree } = useOutletContext<LayoutContext>();
  const t = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.title = `${t.footer.brandName} | ${t.hero.titleLine1}${t.hero.titleLine2}`;
  }, [t.footer.brandName, t.hero.titleLine1, t.hero.titleLine2]);

  // Module modal state
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'booking' | null>(null);

  const handleOpenModuleDetails = (module: ModuleItem) => {
    setSelectedModule(module);
    setModalMode('details');
  };

  const handleOpenModuleBooking = (module: ModuleItem) => {
    setSelectedModule(module);
    setModalMode('booking');
  };

  const handleCloseModuleModal = () => {
    setSelectedModule(null);
    setModalMode(null);
  };

  // Arriving from another route with a pending section to scroll to
  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;
    const el = document.getElementById(scrollTo);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [location.state]);

  return (
    <>
      {/* Hero Headline & Key Badges */}
      <HeroSection onTryFree={openTryFree} />

      {/* Real Student Testimonials Section */}
      <TestimonialsSection />

      {/* 3D Depth Carousel Section for 4 Core Modules */}
      <Module3DCarousel
        modules={modulesData}
        onSelectModule={handleOpenModuleDetails}
        onBooking={handleOpenModuleBooking}
      />

      {/* Module Details / Booking Modal */}
      <ModuleDetailModal
        module={selectedModule}
        mode={modalMode}
        onClose={handleCloseModuleModal}
        onBookingSuccess={(moduleTitle) => showToast(t.toast.bookingSuccess(moduleTitle))}
        onValidationError={showToast}
      />
    </>
  );
}
