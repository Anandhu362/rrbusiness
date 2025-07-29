import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    Phone, Mail, MapPin, Instagram, Linkedin, Twitter, Facebook, 
    Send, ArrowUp, Headset, Bell // Added Bell
} from 'lucide-react';

const Footer = () => {
  const socialLinks = {
    instagram: "https://instagram.com/yourprofile",
    linkedin: "https://linkedin.com/in/yourprofile",
    twitter: "https://twitter.com/yourprofile",
    facebook: "https://facebook.com/yourprofile"
  };
  const mapLink = "https://www.google.com/maps/search/?api=1&query=RR+Business+Group,Valakom,691532,India";

  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAnimationState, setNewsletterAnimationState] = useState<'idle' | 'takeoff' | 'bellShake'>('idle');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  const toggleVisibility = () => {
    setIsBackToTopVisible(window.pageYOffset > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNewsletterSubmitting || newsletterAnimationState !== 'idle' || !newsletterEmail) return;

    setIsNewsletterSubmitting(true);
    setNewsletterAnimationState('takeoff');

    // Plane takeoff animation duration: 1s (as per CSS)
    setTimeout(() => {
      setNewsletterAnimationState('bellShake');
      
      // Bell shake animation duration: 0.6s * 3 repeats = 1.8s (as per CSS)
      // Simulate API call during bell shake
      setTimeout(() => {
        // Actual API call for newsletter would go here
        console.log('Newsletter submitted for:', newsletterEmail);
        alert(`Thank you for subscribing, ${newsletterEmail}!`);
        
        setNewsletterAnimationState('idle');
        setNewsletterEmail('');
        setIsNewsletterSubmitting(false);
      }, 1800); // Duration of bell shake

    }, 1000); // Duration of plane takeoff
  };

  return (
    <>
      <footer className="bg-[#2C3E50] text-[#E0E7FF] font-sans relative">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {/* Company Info */}
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center mb-4 group">
                <img src="/logo.JPG" alt="RR Business Group Logo" className="w-10 h-10 mr-3 object-contain transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#4FA6F7] transition-colors">RR BUSINESS GROUP</h3>
              </Link>
              <p className="text-sm text-[#BDC3C7] mb-6 leading-relaxed">
                A trusted name in foodstuff trading in India and Dubai, specializing in sourcing, distributing, and supplying high-quality food products worldwide.
              </p>
              <div className="flex space-x-4">
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:scale-110 transform transition-all duration-200"><Instagram size={22} /></a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:scale-110 transform transition-all duration-200"><Linkedin size={22} /></a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:scale-110 transform transition-all duration-200"><Twitter size={22} /></a>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:scale-110 transform transition-all duration-200"><Facebook size={22} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold font-heading text-white mb-5 pb-2 border-b border-[#4A5568]">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Home</Link></li>
                <li><Link to="/about" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">About Us</Link></li>
                <li><Link to="/products" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Products</Link></li>
                <li><Link to="/sustainability" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Sustainability</Link></li>
                <li><Link to="/contact" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Our Products */}
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold font-heading text-white mb-5 pb-2 border-b border-[#4A5568]">Our Products</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/products/grains-rice" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Grains & Rice</Link></li>
                <li><Link to="/products/oils-ghee" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Oils & Ghee</Link></li>
                <li><Link to="/products/jaggery" className="text-[#BDC3C7] hover:text-[#4FA6F7] hover:pl-1 transition-all duration-200">Jaggery Products</Link></li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h3 className="text-lg font-semibold font-heading text-white mb-5 pb-2 border-b border-[#4A5568]">Get in Touch</h3>
              <ul className="space-y-4 text-sm mb-6">
                <li className="flex items-start">
                  <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-[#7B8A9E]" />
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-[#BDC3C7] hover:text-[#4FA6F7] transition-colors">
                    RR Business Group, Valakom, PIN: 691532, Kerala, India
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="mr-3 flex-shrink-0 text-[#7B8A9E]" />
                  <a href="tel:+919895501632" className="text-[#BDC3C7] hover:text-[#4FA6F7] transition-colors">
                    +91 9895501632
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail size={20} className="mr-3 flex-shrink-0 text-[#7B8A9E]" />
                  <a href="mailto:info@rrbusinessgroup.com" className="text-[#BDC3C7] hover:text-[#4FA6F7] transition-colors break-all">
                    info@rrbusinessgroup.com
                  </a>
                </li>
              </ul>
              
              <h4 className="text-md font-semibold font-heading text-white mb-3">Newsletter</h4>
              <p className="text-xs text-[#BDC3C7] mb-3">Subscribe to our newsletter for updates.</p>
              <form onSubmit={handleNewsletterSubmit}>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={isNewsletterSubmitting || newsletterAnimationState !== 'idle'}
                    className="w-full px-4 py-2.5 text-sm bg-[#3B4A5A] text-white border border-[#4A5568] rounded-l-md focus:ring-1 focus:ring-[#4FA6F7] focus:border-[#4FA6F7] outline-none placeholder-gray-400"
                  />
                  <button 
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    disabled={isNewsletterSubmitting || newsletterAnimationState !== 'idle'}
                    className="bg-[#4FA6F7] hover:bg-[#3B82F6] text-white px-3 py-2.5 rounded-r-md transition-colors relative overflow-hidden w-[52px] h-[46px] flex items-center justify-center" // Fixed size for button, relative, overflow-hidden
                  >
                    {newsletterAnimationState === 'idle' && <Send size={18} />}
                    {newsletterAnimationState === 'takeoff' && (
                      <Send size={18} className="animate-plane-takeoff" />
                    )}
                    {newsletterAnimationState === 'bellShake' && (
                      <Bell size={18} className="animate-bell-shake" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-[#4A5568] mt-10 pt-6 text-center text-xs text-[#9AA5B4]">
            <p>© {new Date().getFullYear()} RR Business Group. All Rights Reserved. Crafted with care.</p>
          </div>
        </div>
      </footer>

      {/* Customer Care Floating Button */}
      <Link
        to="/contact"
        className="fixed bottom-[80px] right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2C3E50] focus:ring-green-500 z-50"
        // Tailwind equivalent for bottom: '5rem' is bottom-20 (80px)
        aria-label="Contact Customer Care"
        title="Customer Care"
      >
        <Headset size={24} />
      </Link>

      {/* Back to Top Button */}
      {isBackToTopVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#4FA6F7] hover:bg-[#3B82F6] text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2C3E50] focus:ring-[#4FA6F7] z-50 opacity-100 hover:opacity-100" // Ensure visible
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default Footer;