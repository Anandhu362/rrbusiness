import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ScrollToTop from './utils/ScrollToTop';
import SustainabilityPage from './pages/SustainabilityPage';
import ManagementPage from './pages/ManagementPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {/* ✅ Removed Navbar from here */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/management" element={<ManagementPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
