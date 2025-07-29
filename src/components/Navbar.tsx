import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Slightly increased threshold
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check in case page loads scrolled
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to handle body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' }, // Assuming path corrected from /services
    { name: 'Management', path: '/management' },     // Assuming path corrected from /services
    { name: 'Contact', path: '/contact' },
  ];

  const headerBaseClass = "fixed w-full z-50 transition-all duration-300 ease-in-out font-sans";
  const headerScrolledClass = "bg-white/95 shadow-lg backdrop-blur-md py-3"; // Adjusted padding for scrolled state
  const headerTopClass = "bg-[#2C3E50]/80 backdrop-blur-sm py-3"; // Adjusted padding for top state

  const linkBaseClass = "relative font-medium font-sans transition-colors duration-300";
  const linkScrolledClass = "text-[#1E293B]";
  const linkTopClass = "text-white";
  const linkHoverClass = "hover:text-[#2563EB]"; // Primary hover color

  const activeLinkUnderline = "after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-[3px] after:bg-[#2563EB] after:transition-all after:duration-300";


  return (
    <header
      className={`${headerBaseClass} ${
        scrolled ? headerScrolledClass : headerTopClass
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20"> {/* Consistent height */}
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 group"> {/* Added group for hover effects */}
            <img
              src="/logo.JPG"
              alt="RR Business Logo"
              className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110" // Scale on group hover
            />
            <span
              className={`font-bold text-xl md:text-2xl font-heading transition-colors duration-300 ${
                scrolled ? 'text-[#1E293B]' : 'text-white'
              } group-hover:text-[#4FA6F7]`} // Text color change on group hover
            >
              RR Business Group
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8"> {/* Adjusted spacing */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${linkBaseClass} ${scrolled ? linkScrolledClass : linkTopClass} ${linkHoverClass} ${activeLinkUnderline} 
                           ${location.pathname === link.path ? 'after:w-full text-[#2563EB]' : 'after:w-0'}`}
              >
                <span className="inline-block transition-transform duration-200 ease-out hover:-translate-y-px">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 transition-colors duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-inset ${
              scrolled ? 'text-[#1E293B] focus:ring-[#1E293B]' : 'text-white focus:ring-white'
            }`}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu-nav"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />} {/* Slightly larger icons */}
          </button>
        </div>

        {/* Mobile Nav - with slide-down animation */}
        <nav 
          id="mobile-menu-nav"
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl z-40 
                     transition-all duration-300 ease-in-out transform overflow-hidden
                     ${isOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col space-y-2 px-4 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-3 px-3 rounded-md font-medium font-sans text-[#1E293B] transition-colors duration-200 hover:bg-gray-100 hover:text-[#2563EB] ${
                  location.pathname === link.path ? 'text-[#2563EB] bg-blue-50' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;