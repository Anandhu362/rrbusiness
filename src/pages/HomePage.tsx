import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ProductCategories from '../components/ProductCategories';
import GlobalReach from '../components/GlobalReach';
import QualityAssurance from '../components/QualityAssurance';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';

const HomePage: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Management', path: '/management' },
    { name: 'Contact', path: '/contact' },
  ];

  // Intersection Observer for scroll animations on sections
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = (entries: IntersectionObserverEntry[], observerInstance: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('is-visible');
          observerInstance.unobserve(element); // Animate only once
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    const elementsToObserve: (HTMLElement | null)[] = [
        heroSectionRef.current,
        ...sectionRefs.current
    ].filter(el => el !== null);

    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
        elementsToObserve.forEach(el => { if (el) observer.unobserve(el); });
        observer.disconnect();
    };
  }, []); // Empty dependency array: runs once on mount

  // Scroll listener for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { // Cleanup on component unmount
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current[index] = el;
    }
  };

  return (
    <div className="pt-0 bg-[#F8FAFC]"> {/* Main Page Background */}
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out font-sans ${
          isScrolled
            ? 'bg-[#2C3E50]/90 backdrop-blur-md shadow-lg py-4' // Scrolled: dark background from AboutPage
            : 'bg-transparent py-4' // Not scrolled: transparent background from AboutPage
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <img
              src="/logo.JPG"
              alt="RR Business Group Logo"
              className="h-12 w-12 object-contain" // Style from AboutPage
              loading="lazy"
            />
            <span className="font-bold text-xl text-white"> {/* Style from AboutPage (always white) */}
              RR BUSINESS GROUP
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8"> {/* space-x-8 from AboutPage */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium relative transition-colors duration-300
                           after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-[#4FA6F7]
                           after:transition-all after:duration-300
                           ${location.pathname === link.path
                               ? 'text-[#4FA6F7] after:w-full' // Active: highlight color and full underline
                               : 'text-white hover:text-[#4FA6F7] after:w-0 hover:after:w-full' // Default: white, hover changes color and underline
                           }`}
              >
                {link.name} {/* Removed inner span with hover effect */}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 focus:outline-none" // Simplified style from AboutPage, p-2 kept for usability
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-nav"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />} {/* size 24 from AboutPage */}
          </button>
        </div>

        {/* Mobile Nav - Using HomePage's transition mechanism with AboutPage's styling */}
        <nav
          id="mobile-menu-nav"
          className={`md:hidden absolute top-full left-0 w-full bg-[#2C3E50]/95 shadow-lg z-40
                      transition-all duration-300 ease-in-out transform overflow-hidden
                      ${menuOpen
                          ? 'max-h-[500px] opacity-100 translate-y-0'
                          : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col space-y-2 px-4 py-4"> {/* Adjusted padding & spacing */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-white font-medium transition-colors duration-200
                            ${location.pathname === link.path ? 'text-[#4FA6F7]' : 'hover:text-[#4FA6F7]'
                            }`} // Style from AboutPage mobile nav links
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="relative hero-base-animation" // Animation class
      >
        <Hero />
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={addSectionRef(0)}
        className="py-16 md:py-20 bg-white section-base-animation" // Animation class
      >
        <AboutSection />
      </section>

      {/* Product Categories */}
      <section
        id="products-overview"
        ref={addSectionRef(1)}
        className="py-16 md:py-20 bg-[#F8FAFC] section-base-animation" // Animation class
      >
        <ProductCategories />
      </section>

      {/* Global Reach */}
      <section
        id="global-reach"
        ref={addSectionRef(2)}
        className="py-16 md:py-20 bg-white section-base-animation" // Animation class
      >
        <GlobalReach />
      </section>

      {/* Quality Assurance */}
      <section
        id="quality"
        ref={addSectionRef(3)}
        className="py-16 md:py-20 bg-[#F8FAFC] section-base-animation" // Animation class
      >
        <QualityAssurance />
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        ref={addSectionRef(4)}
        className="py-16 md:py-20 bg-white section-base-animation" // Animation class
      >
        <Testimonials />
      </section>

      {/* Contact Form Section */}
      <section
        id="contact"
        ref={addSectionRef(5)}
        className="py-16 md:py-20 bg-slate-100 section-base-animation" // Animation class
      >
        <ContactForm />
      </section>

    </div>
  );
};

export default HomePage;