import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone, MapPin, Send, CheckCircle as CheckCircleIcon, ChevronDown, FileText, TrendingUp, Users, Truck, ShieldCheck, Clock } from 'lucide-react'; // Added missing icons from AboutPage nav structure if needed, though navLinks don't use them directly.
import axios from 'axios';

// navLinksData is used by the new navbar structure
const navLinksData = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Sustainability', path: '/sustainability' },
  { name: 'Management', path: '/management' },
  { name: 'Contact', path: '/contact' },
];

// NavbarComponent is removed as its logic is now integrated directly below

interface ContactAction { text: string; href: string; }
interface ContactItem { icon: React.ReactNode; title: string; details: string[]; actions?: ContactAction[]; action?: ContactAction; }
interface FormDataState { user_name: string; user_email: string; user_phone: string; user_company: string; message: string; }

const useArrayRef = () => {
  const refs = useRef<(HTMLElement | null)[]>([]);
  refs.current = [];
  const addRef = useCallback((el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  }, []);
  return [refs, addRef] as const;
};


const ContactPage: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // toggleMobileMenu is now toggleMenu to match AboutPage's internal naming for the button
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen); 
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  const [animatedElementsRefs, addAnimatedElementRef] = useArrayRef();

  useEffect(() => {
    const handlePageScroll = () => {
      const scrolled = window.scrollY > 50; // Standard scroll threshold from AboutPage
      if (isPageScrolled !== scrolled) {
        setIsPageScrolled(scrolled);
      }
      const scrollY = window.scrollY;
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroTextRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 350)}`;
      }
      if (heroImageRef.current) {
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    handlePageScroll();
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, [isPageScrolled]);

 useEffect(() => {
    const observerOptions: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const animateOnScroll = (entries: IntersectionObserverEntry[], observerInstance: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('is-visible');
          observerInstance.unobserve(element);
        }
      });
    };
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const currentRefs = animatedElementsRefs.current.slice(); 
    currentRefs.forEach(el => { if (el) observer.observe(el); });
    
    return () => {
        currentRefs.forEach(el => { if (el) observer.unobserve(el); });
        observer.disconnect();
    };
  }, [animatedElementsRefs, animatedElementsRefs.current.length]);


  const [formData, setFormData] = useState<FormDataState>({ user_name: '', user_company: '', user_email: '', user_phone: '', message: '' });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [animatePlane, setAnimatePlane] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formSubmitted) setFormSubmitted(false);
    if (formError) setFormError('');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitted(false);
    setIsLoading(true);
    setAnimatePlane(true);

    if (!formData.user_name.trim() || !formData.user_email.trim() || !formData.message.trim()) {
      setFormError('Please fill in all required fields: Name, Email, and Message.');
      setIsLoading(false);
      setAnimatePlane(false);
      return;
    }

    try {
      const { hostname, protocol } = window.location;
      const isDevelopment = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development';
      
      const API_BASE_URL = isDevelopment
        ? `${protocol}//${hostname}:3000`
        : '';

      const response = await axios.post(
        `${API_BASE_URL}/api/send-email`, 
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setFormSubmitted(true);
        setFormData({ user_name: '', user_company: '', user_email: '', user_phone: '', message: '' });
      } else {
        setFormError(response.data.message || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      let errorMessage = 'Failed to send message. Please check your connection and try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (animatePlane && !isLoading) { 
      const timer = setTimeout(() => {
        setAnimatePlane(false);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [animatePlane, isLoading]);


  useEffect(() => {
    if (mobileMenuOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const contactInfoData: ContactItem[] = [
    { icon: <Phone />, title: 'WhatsApp/Call', details: ['+91 9895501632'], actions: [{ text: 'Call Us', href: 'tel:+919895501632' },{ text: 'WhatsApp Us', href: 'https://wa.me/919895501632?text=Hello%20RR%20Business%20Group!' },],},
    { icon: <Mail />, title: 'Email Us', details: ['info@rrbusinessgroup.com'], action: { text: 'Send an Email', href: 'mailto:info@rrbusinessgroup.com' },},
    { icon: <MapPin/>, title: 'Our Location', details: ['RR Business Group, Valakom PO, Kottarakkara, Kollam, Kerala, India - 691532'], action: { text: 'View on Google Maps', href: 'https://maps.google.com/?q=RR+Business+Group,Valakom+PO,Kottarakkara,Kollam,Kerala,India,691532' },},
  ];
  const officesData = [
    { city: 'Dubai', country: 'United Arab Emirates', address: 'Al Qusais Industrial Area 3, Dubai', phone: '+971 55 598 5347', email: 'info@rrbusinessgroup.com', image: '/dubai.jpg' },
    { city: 'Kerala (HQ)', country: 'India', address: 'Valakom PO, Kottarakkara, Kollam, PIN: 691532', phone: '+91 9895 501632', email: 'info@rrbusinessgroup.com', image: '/kerala.jpg' }
  ];
  const faqsData = [
    { question: 'What are your minimum order quantities (MOQ)?', answer: 'Our MOQs vary by product category and specific item. Please contact our sales team with your requirements for detailed information.' },
    { question: 'Can you provide product samples before a bulk order?', answer: 'Yes, we can provide samples for most of our products upon request to genuine business inquiries. Sample and shipping fees may apply, which are often adjustable against a bulk order.' },
    { question: 'What are your standard shipping methods and incoterms?', answer: 'We offer flexible shipping solutions including sea freight (FCL/LCL) and air freight. Common incoterms are FOB, CIF, and CNF, but we can discuss other terms to suit your needs.' },
    { question: 'Do you offer private labeling or OEM services?', answer: 'Yes, we provide private labeling and OEM services for many of our products. Contact our sales team to discuss your specific branding and packaging requirements.' },
    { question: 'What are your accepted payment methods?', answer: 'We typically accept Telegraphic Transfers (T/T) and Irrevocable Letters of Credit (L/C) at sight. Other payment terms may be considered based on the order volume and business relationship.' }
  ];

  let formButtonBaseClasses = "relative inline-flex items-center justify-center px-6 py-3 text-base text-white font-semibold rounded-lg w-full transition-all duration-300 ease-in-out overflow-hidden h-[50px] focus:outline-none focus:ring-2 focus:ring-offset-2";
  let formButtonColorClasses = "";

  if (formSubmitted && !formError) {
    formButtonColorClasses = "bg-green-500 hover:bg-green-600 focus:ring-green-500";
  } else if (isLoading) {
    formButtonColorClasses = "bg-blue-500 opacity-75 cursor-not-allowed focus:ring-blue-500";
  } else {
    formButtonColorClasses = "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 shadow-md hover:shadow-lg";
  }
  const currentIsButtonDisabled = isLoading || (formSubmitted && !formError);

  const formInputBaseStyles = "w-full px-4 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed";
  const formTextareaStyles = `${formInputBaseStyles} min-h-[120px]`;


  return (
    <div className="pt-0 bg-[#F8FAFC] font-sans"> {/* Removed font-sans from header, apply globally if needed */}
      {/* Navbar structure from AboutPage, adapted for ContactPage state/props */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isPageScrolled ? 'bg-[#2C3E50]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        {/* Inner container with AboutPage's padding and max-width */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <img
              src="/logo.JPG"
              alt="RR Business Group Logo" // Changed alt to be more descriptive
              className="h-12 w-12 object-contain" // Standard logo size from AboutPage
              loading="lazy"
            />
            <span className="text-white font-bold text-xl">RR BUSINESS GROUP</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8"> {/* space-x-8 from AboutPage */}
            {navLinksData.map((link) => ( // Using navLinksData from ContactPage
              <Link
                key={link.name}
                to={link.path}
                className={`text-white font-medium relative hover:text-sky-400 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-sky-400 after:transition-all after:duration-300 ${
                  location.pathname === link.path ? 'after:w-full !text-sky-400' : 'after:w-0 hover:after:w-full' // Active link style: underline + sky blue text
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleMenu} // Using ContactPage's toggleMenu
            className="md:hidden text-white focus:outline-none p-1 hover:opacity-80 transition-opacity" // Simplified mobile button, added padding
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-main" // Changed ID for clarity
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Icon size from AboutPage */}
          </button>
        </div>
        {/* Mobile menu structure from AboutPage */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu-main" // Matches aria-controls
            className="md:hidden bg-[#2C3E50]/95 text-white px-4 pb-4 space-y-3 shadow-lg animate-fadeIn" // Added space-y-3 for item spacing
            // Removed fixed positioning, top, height, transform, overflow-y as this menu is now part of the header flow
          >
            {navLinksData.map((link) => ( // Using navLinksData from ContactPage
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)} // Using ContactPage's setMobileMenuOpen
                className={`block py-2.5 px-3 text-lg font-medium transition-all duration-200 rounded-md ${ // Adjusted padding and text size for consistency
                  location.pathname === link.path ? 'text-sky-300 bg-white/5 scale-105' : 'hover:text-sky-300 hover:bg-white/10 hover:pl-5' // Slightly adjusted active/hover
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section - Ensure pt-16/pt-20 on content div is enough to clear fixed header */}
      <section className="relative h-[480px] md:h-[520px] text-white overflow-hidden">
        <div ref={heroImageRef} className="absolute inset-0 overflow-hidden rounded-b-[60px] will-change-transform">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/contact.jpg')", backgroundPosition: 'center 20%', backgroundAttachment: 'fixed' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A2533]/70 via-[#2C3E50]/50 to-[#1A2533]/70 backdrop-brightness-60"></div>
          </div>
        </div>
        <div className="relative z-20 container mx-auto px-4 md:px-6 flex items-center h-full pt-20 md:pt-24"> {/* Increased top padding for hero content */}
          <div ref={heroTextRef} className="max-w-3xl" style={{willChange: 'transform, opacity'}}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl animate-fadeInUp" style={{animationDelay: '0.1s'}}>Get In Touch</h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-4 leading-relaxed drop-shadow-lg animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              Have questions or ready to place an order? Reach out to our team for personalized assistance.
            </p>
            <p className="text-gray-200 text-lg drop-shadow-lg animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              Our dedicated team is ready to assist with inquiries, custom orders, and shipping solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 md:py-20 bg-[#F8FAFC] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div ref={addAnimatedElementRef} className="initial-hidden-state" style={{ transitionDelay: '0.1s' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-6">Contact Information</h2>
              <p className="text-slate-700 mb-10 leading-relaxed text-lg">
                We're here to help and answer any question you might have. We look forward to hearing from you through any of our channels.
              </p>
              <div className="space-y-8">
                {contactInfoData.map((info) => (
                  <div key={info.title} className="flex items-start p-2 transition-all duration-300 group rounded-lg hover:bg-slate-100">
                    <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-sky-100 group-hover:bg-sky-200 flex items-center justify-center mr-5 transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                      {React.cloneElement(info.icon as React.ReactElement, { className: "h-7 w-7 text-[#2563EB]"})}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#1E293B] group-hover:text-blue-600 transition-colors">{info.title}</h3>
                      <div className="mt-1 text-slate-600">
                        {info.details.map((detail, idx) => (<p key={idx} className="text-base">{detail}</p>))}
                      </div>
                      {info.actions ? (
                        <div className="mt-3 space-x-4">
                          {info.actions.map((action) => (
                            <a key={action.text} href={action.href} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">{action.text}</a>
                          ))}
                        </div>
                      ) : ( info.action && (
                          <a href={info.action.href} className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">{info.action.text}</a>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={addAnimatedElementRef} className="bg-white rounded-xl p-6 md:p-10 shadow-2xl initial-hidden-state" style={{ transitionDelay: '0.2s' }}>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#1E293B] mb-8 text-center">Send Us a Message</h3>
              {formSubmitted && !formError && (
                <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-400 text-green-700 animate-fadeIn text-center">
                  <CheckCircleIcon className="inline-block mr-2 h-5 w-5" /> Thank you! Your message has been sent. We'll respond shortly.
                </div>
              )}
              {formError && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-400 text-red-700 animate-fadeIn text-center">
                  {formError}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="text" name="user_name" placeholder="Full Name*" required aria-required="true" aria-label="Full Name" value={formData.user_name} onChange={handleFormChange} className={formInputBaseStyles} disabled={currentIsButtonDisabled}/>
                  <input type="email" name="user_email" placeholder="Email Address*" required aria-required="true" aria-label="Email Address" value={formData.user_email} onChange={handleFormChange} className={formInputBaseStyles} disabled={currentIsButtonDisabled}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="tel" name="user_phone" placeholder="Phone (Optional)" aria-label="Phone" value={formData.user_phone} onChange={handleFormChange} className={formInputBaseStyles} disabled={currentIsButtonDisabled}/>
                  <input type="text" name="user_company" placeholder="Company (Optional)" aria-label="Company" value={formData.user_company} onChange={handleFormChange} className={formInputBaseStyles} disabled={currentIsButtonDisabled}/>
                </div>
                <textarea name="message" rows={5} placeholder="Your Message*" required aria-required="true" aria-label="Your Message" value={formData.message} onChange={handleFormChange} className={formTextareaStyles} disabled={currentIsButtonDisabled}></textarea>

                <button
                  type="submit"
                  disabled={currentIsButtonDisabled}
                  className={`${formButtonBaseClasses} ${formButtonColorClasses}`}
                >
                  {formSubmitted && !formError ? (
                    <> <CheckCircleIcon size={20} className="mr-2.5" /> Message Sent! </>
                  ) : isLoading ? (
                    <>
                      <span className="mr-2.5">Sending...</span>
                      <span className={animatePlane ? 'animate-fly-off-wrapper' : 'inline-block'}>
                        <Send size={18} />
                      </span>
                    </>
                  ) : (
                    <> Send Message <Send size={18} className="ml-2.5" /> </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <h2 ref={addAnimatedElementRef} className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-12 md:mb-16 text-center initial-hidden-state" style={{transitionDelay: '0.1s'}}>Our Global Offices</h2>
          <div ref={addAnimatedElementRef} className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 initial-hidden-state" style={{transitionDelay: '0.2s'}}>
            {officesData.map((office, index) => (
              <div key={office.city} className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out initial-hidden-state transform hover:-translate-y-2 group"
                   ref={addAnimatedElementRef} style={{ transitionDelay: `${0.3 + index * 0.15}s`}}>
                <div className="h-60 overflow-hidden"><img src={office.image} alt={`${office.city} Office`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/></div>
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-semibold text-[#1E293B] mb-1 group-hover:text-blue-600 transition-colors">{office.city}</h3>
                  <p className="text-blue-500 font-medium mb-4 text-sm">{office.country}</p>
                  <div className="space-y-3 text-slate-700 text-sm">
                    <p className="flex items-start"><MapPin size={16} className="mr-3 mt-0.5 text-slate-400 shrink-0" />{office.address}</p>
                    <p className="flex items-center"><Phone size={16} className="mr-3 text-slate-400 shrink-0" /><a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition-colors duration-300">{office.phone}</a></p>
                    <p className="flex items-center"><Mail size={16} className="mr-3 text-slate-400 shrink-0" /><a href={`mailto:${office.email}`} className="hover:text-blue-600 transition-colors duration-300 break-all">{office.email}</a></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div ref={addAnimatedElementRef} className="max-w-4xl mx-auto initial-hidden-state" style={{transitionDelay: '0.1s'}}>
            <h2 ref={addAnimatedElementRef} className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-10 md:mb-12 text-center initial-hidden-state" style={{transitionDelay: '0.2s'}}>Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqsData.map((faq, index) => (
                <details key={faq.question} className="group bg-slate-50 p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 initial-hidden-state" ref={addAnimatedElementRef} style={{ transitionDelay: `${0.3 + index * 0.1}s` }}>
                  <summary className="flex justify-between items-center text-lg font-semibold text-[#1E293B] cursor-pointer list-none group-hover:text-blue-600 transition-colors">
                    {faq.question}
                    <ChevronDown className="h-6 w-6 transition-transform duration-300 group-open:rotate-180 text-slate-500 group-hover:text-blue-600" />
                  </summary>
                  <div className="text-slate-700 mt-4 text-base leading-relaxed pt-4 border-t border-slate-200 group-open:animate-fadeIn">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;