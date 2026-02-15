import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

// Public Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import SettingsPanel from './components/SettingsPanel';
import ServiceCards from './components/ServiceCards';
import SplitPhotoGallery from './components/SplitPhotoGallery';
import CV from './pages/CV';

// Public Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Certificates from './sections/Certificates';
import Experience from './sections/Experience';
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
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />} />
      <Route path="/cv" element={<CV />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
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
