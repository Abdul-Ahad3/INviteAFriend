import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Tutorial from './pages/Tutorial';
import LogSign from './pages/LogSign';
import Dashboard from './pages/Dashboard';
import Me from './pages/Me';

type DashboardMode = 'visitor' | 'host';
type Theme = 'light' | 'dark';

function AppContent() {
  const location = useLocation();
  const isDashboardArea =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/me');
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('visitor');
  const [theme, setTheme] = useState<Theme>('light');

  const toggleDashboardMode = () => {
    setDashboardMode((currentMode) =>
      currentMode === 'visitor' ? 'host' : 'visitor',
    );
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app-shell ${theme}-theme`}>
      <Header
        title={isDashboardArea ? 'Dashboard' : 'InviteAFriend'}
        links={
          isDashboardArea
            ? [{ label: 'Profile', to: '/me' }]
            : [
                { label: 'Get Started', to: '/tutorial' },
                { label: 'Login/Signup', to: '/logsign' },
              ]
        }
        actions={
          isDashboardArea
            ? [
                {
                  label:
                    dashboardMode === 'visitor'
                      ? 'Visitor Mode'
                      : 'Host Mode',
                  onClick: toggleDashboardMode,
                  active: true,
                },
              ]
            : []
        }
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <Features />
              <CTASection />
              <Footer />
            </>
          }
        />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/logsign" element={<LogSign />} />
        <Route
          path="/dashboard"
          element={<Dashboard mode={dashboardMode} />}
        />
        <Route path="/me" element={<Me />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
