/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FluidBackground from './components/FluidBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConnectModal from './components/ConnectModal';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Sermons from './pages/Sermons';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

const App: React.FC = () => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black overflow-x-hidden">
        <CustomCursor />
        <FluidBackground />
        
        <Navbar onConnectClick={() => setConnectModalOpen(true)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>

        <Footer />

        <ConnectModal 
          isOpen={connectModalOpen} 
          onClose={() => setConnectModalOpen(false)} 
          type="visit" 
        />
      </div>
    </Router>
  );
};

export default App;