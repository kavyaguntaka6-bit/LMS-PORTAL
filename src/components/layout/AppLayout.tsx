import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';
import { NotificationDrawer } from '../navigation/NotificationDrawer';
import { AITutorDrawer } from '../navigation/AITutorDrawer';
import { FloatingAiTutorButton } from '../ai/FloatingAiTutorButton';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  // Hide footer on distraction-free lesson player and coding playground
  const hideFooter = location.pathname.startsWith('/learn/') || location.pathname === '/coding';

  return (
    <div className="min-h-screen flex flex-col bg-tyc-bg dark:bg-[#0B0F19] text-tyc-text dark:text-slate-100 transition-colors duration-200 relative">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Page Content with smooth fade transitions */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Highlighted AI Tutor Button on Bottom Right */}
      <FloatingAiTutorButton />

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <AITutorDrawer />

      {/* Conditional Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};
