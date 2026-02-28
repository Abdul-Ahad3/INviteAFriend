import React from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <CTASection />
      <Footer />
    </>
  );
}

export default App;
