import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { PageTransition } from './components/PageTransition';
import { ScrollToTop } from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BookPage from './pages/BookPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageTransition />

      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin login: standalone, no chrome (not authenticated yet) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Admin dashboard: minimal nav (logo + logout) and the shared footer */}
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  );
}
