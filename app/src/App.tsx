import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Heavy routes are code-split so public visitors never download them.
// AdminLogin / AdminDashboard pull the whole admin CMS; CV pulls print libs.
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const CV = lazy(() => import('./pages/CV'));

// Public Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import SettingsPanel from './components/SettingsPanel';
import ServiceCards from './components/ServiceCards';
import SplitPhotoGallery from './components/SplitPhotoGallery';
// Public Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Certificates from './sections/Certificates';
import Experience from './sections/Experience';
import Research from './sections/Research';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimationProvider, useAnimation } from './context/AnimationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useVisitorTracking } from './hooks/useVisitorTracking';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 border-2 border-electric/30 border-t-electric rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

// Public Layout with Preloader
const PublicLayout = () => {
  const { isLoading } = useAnimation();
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';
  useVisitorTracking();

  return (
    <>
      <Preloader />
      <motion.div 
        className="relative min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
        }}
        transition={{ 
          duration: 0.8,
          delay: isLoading ? 0 : 0.3,
        }}
      >
        <Navigation />
        <main>
          <Hero />
          <About />
          <ServiceCards />
          <SplitPhotoGallery />
          <Projects />
          <Skills />
          <Certificates />
          <Experience />
          <Research />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <SettingsPanel />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: isLightTheme ? '#ffffff' : '#141414',
              border: isLightTheme ? '1px solid rgba(15,23,42,0.12)' : '1px solid rgba(255,255,255,0.1)',
              color: isLightTheme ? '#0f172a' : '#fff',
            },
          }}
        />
      </motion.div>
    </>
  );
};

// App Router
const RouteFallback = (
  <div className="min-h-screen bg-charcoal flex items-center justify-center">
    <motion.div
      className="w-8 h-8 border-2 border-electric/30 border-t-electric rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />} />
      <Route path="/cv" element={<Suspense fallback={RouteFallback}><CV /></Suspense>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Suspense fallback={RouteFallback}><AdminLogin /></Suspense>} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={RouteFallback}><AdminDashboard /></Suspense>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}

export default App;
