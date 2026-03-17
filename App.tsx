/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FluidBackground from './components/FluidBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConnectModal from './components/ConnectModal';
import ScrollToTop from './components/ScrollToTop';
import AdminRoute from './components/AdminRoute';
import { getSiteMetadata, SiteMetadata } from './services/contentService';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Ministries = lazy(() => import('./pages/Ministries'));
const Events = lazy(() => import('./pages/Events'));
const Sermons = lazy(() => import('./pages/Sermons'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const AppContent: React.FC = () => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState<string>('');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const meta = await getSiteMetadata();
        if (mounted && meta?.bannerText) setBannerText(meta.bannerText);
      } catch {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      {!isAdminRoute && <Navbar bannerText={bannerText} onConnectClick={() => setConnectModalOpen(true)} />}

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </Suspense>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <ConnectModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          type="visit"
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <ScrollToTop />
    <AppContent />
  </Router>
);


export default App;