import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Tutorial from './pages/Tutorial';
import LogSign from './pages/LogSign';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Header title={'InviteAFriend'} buttons={['Getting Started', 'Login/Signup']} />
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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
