import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Play,
  Pause,
  Menu,
  X,
  Globe,
  HeartHandshake,
  Sprout,
  FlaskConical,
  Users as UsersIcon, // Renamed to avoid conflict if 'Users' was also a component
  Briefcase,
  Leaf,
  Recycle as RecycleIcon, // Changed alias to avoid conflict with potential 'Recycling' component
  Truck,
  ShieldCheck
} from 'lucide-react';
import BackgroundDots from '../components/BackgroundDots'; // Assuming this component exists

interface SustainabilityPoint {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SustainabilityPage = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Initial state to false, autoplay will attempt to set to true
  const [showControls, setShowControls] = useState(false);

  const heroTextContainerRef = useRef<HTMLDivElement>(null); // For parallax
  const heroTextContentRef = useRef<HTMLDivElement>(null); // For fade-up animation of content
  const heroImageRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sustainabilityCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const futureGoalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Management', path: '/management' },
    { name: 'Contact', path: '/contact' },
  ];

  const stats = [
    { label: 'Plastic Use Reduction Target', value: 30, suffix: '%' },
    { label: 'Local Supplier Engagement', value: 60, suffix: '%' },
    { label: 'Recyclable Packaging Goal', value: 100, suffix: '%' },
  ];

  const sustainabilityCards: SustainabilityPoint[] = [
    { icon: Leaf, title: 'Ethical Sourcing', description: 'We partner with farmers and producers who share our values of fairness, safety, and environmental care.' },
    { icon: RecycleIcon, title: 'Eco-Friendly Packaging', description: 'We actively reduce plastic usage and prioritize recyclable or biodegradable alternatives.' },
    { icon: Truck, title: 'Low-Impact Logistics', description: 'Our optimized transport methods help cut carbon emissions and reduce energy waste.' },
    { icon: ShieldCheck, title: 'Community-Driven Growth', description: 'We invest in local suppliers and empower sustainable livelihoods across our value chain.' },
  ];

  const futureGoalsData: SustainabilityPoint[] = [
    { icon: Globe, title: 'Expand Global Distribution Network', description: 'Launch strategic partnerships in emerging markets to bring our quality products to more regions across Asia, Africa, and Europe.' },
    { icon: HeartHandshake, title: 'Launch Community Nutrition Programs', description: 'Initiate local charity efforts focused on providing healthy food essentials to underprivileged communities in rural areas.' },
    { icon: Sprout, title: 'Empower Small-Scale Farmers Globally', description: 'Expand fair-trade partnerships and offer training resources to help local producers thrive in a competitive global market.' },
    { icon: FlaskConical, title: 'Establish R&D for Quality Innovation', description: 'Set up an in-house quality lab and research team focused on food safety, freshness retention, and advanced packaging.' },
    { icon: UsersIcon, title: 'Create Local Employment Opportunities', description: 'As we expand, we are committed to hiring locally and empowering regional workforces in logistics, sourcing, and retail support.' },
    // Adding a sixth for better grid layout if needed, or ensure design handles 5 items well in a 3-col grid
    // { icon: Briefcase, title: 'Enhance Supply Chain Transparency', description: 'Implement advanced tracking systems to ensure full traceability and ethical practices from farm to shelf.'}
  ];

  // Parallax and header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollY = window.scrollY;
      if (heroTextContainerRef.current) heroTextContainerRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      if (heroImageRef.current) heroImageRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('is-visible'); // General class to mark as seen

          if (element.classList.contains('fade-up-element')) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }

          if (element.classList.contains('stagger-element')) {
            const delay = Number(element.getAttribute('data-delay')) || 0;
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0) scale(1)';
            }, delay * 100);
          }
          // observer.unobserve(element); // Optional: unobserve after animation
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const elementsToObserve: (HTMLElement | null)[] = [
      heroTextContentRef.current, // For hero text content animation
      ...sectionRefs.current,
      ...sustainabilityCardRefs.current,
      ...futureGoalRefs.current,
      ...statCardRefs.current
    ].filter(el => el !== null);

    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Video autoplay attempt
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.muted = true;
      videoElement.playsInline = true;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Autoplay was prevented:", error);
            setIsPlaying(false);
            setShowControls(true); // Show controls if autoplay fails
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            setShowControls(true); // Show controls if manual play fails
          });
      }
    }
  };
  
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="pt-0 bg-[#F8FAFC]"> {/* Overall page background */}
      <section className="relative h-[480px] text-white overflow-hidden">
        <div
          ref={heroImageRef}
          className="absolute inset-0 overflow-hidden rounded-b-[60px] transition-transform duration-1000 will-change-transform"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/ro.png')", // Ensure this path is correct
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center 40%'
            }}
          >
            <div className="absolute inset-0 bg-[#2C3E50]/10 backdrop-brightness-75"></div>
          </div>
        </div>

        <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-[#2C3E50] shadow-lg' : 'bg-transparent md:bg-[#2C3E50]/70 md:backdrop-blur-sm'}`}>
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-screen-xl mx-auto">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <img src="/logo.JPG" alt="RR Business Group Logo" className="h-12 w-12 object-contain" loading="lazy" />
              <span className="text-white font-bold text-xl">RR BUSINESS GROUP</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} className={`text-white font-medium relative hover:text-[#4FA6F7] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#4FA6F7] after:transition-all after:duration-300 ${
                    location.pathname === link.path ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`}>{link.name}</Link>
              ))}
            </nav>
            <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none" aria-expanded={menuOpen} aria-controls="mobile-menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {menuOpen && (
            <div id="mobile-menu" className="md:hidden bg-[#2C3E50]/95 text-white px-4 pb-4 space-y-4 animate-fadeIn shadow-lg"> {/* Assumed animate-fadeIn is defined */}
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setMenuOpen(false)} className={`block py-2 font-medium transition-colors ${location.pathname === link.path ? 'text-[#4FA6F7]' : 'hover:text-[#4FA6F7]'}`}>{link.name}</Link>
              ))}
            </div>
          )}
        </header>

        <div ref={heroTextContainerRef} className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center h-full will-change-transform">
          <div
            ref={heroTextContentRef}
            className="max-w-2xl fade-up-element"
            style={{
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s', // Slightly longer, delayed
              willChange: 'transform, opacity'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">Sustainability at the Core</h1>
            <p className="text-xl text-gray-200">We are committed to ethical sourcing, eco-friendly practices, and building a better future for generations to come.</p>
          </div>
        </div>
      </section>

      {/* Sustainability Cards Section */}
      <section
        ref={el => sectionRefs.current[0] = el}
        className="py-16 bg-white fade-up-element relative" // Added relative for BackgroundDots positioning
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <BackgroundDots />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-bold text-[#1E293B] text-center mb-12">Our Sustainability Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityCards.map((item, i) => (
              <div
                key={item.title} // Use title if unique, otherwise index 'i' is fallback
                ref={el => sustainabilityCardRefs.current[i] = el}
                className="bg-[#F8FAFC] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center stagger-element group"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.98)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out', willChange: 'transform, opacity' }}
                data-delay={i % 4}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#4FA6F7]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#4FA6F7]/20 group-hover:scale-110">
                  <item.icon className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors duration-300">{item.title}</h3>
                <p className="text-[#475569] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals Section */}
      <section
        ref={el => sectionRefs.current[1] = el}
        className="py-16 bg-[#F8FAFC] fade-up-element relative"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <BackgroundDots />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-bold text-[#1E293B] text-center mb-10">Our Future Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureGoalsData.map((goal, i) => (
              <div
                key={goal.title}
                ref={el => futureGoalRefs.current[i] = el}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center stagger-element group h-full flex flex-col" // Added h-full for consistent card height
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.98)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out', willChange: 'transform, opacity' }}
                data-delay={i % 3}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#4FA6F7]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#4FA6F7]/20 group-hover:scale-110">
                  <goal.icon className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors duration-300">{goal.title}</h3>
                <p className="text-[#475569] text-sm flex-grow">{goal.description}</p> {/* flex-grow for description to push content */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        ref={el => sectionRefs.current[2] = el}
        className="py-16 bg-white fade-up-element relative"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <BackgroundDots />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-bold text-[#1E293B] text-center mb-10">Impact in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={el => statCardRefs.current[i] = el}
                className="bg-[#F8FAFC] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 stagger-element"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.98)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out', willChange: 'transform, opacity' }}
                data-delay={i % 3}
              >
                <p className="text-5xl font-bold text-[#2563EB]">{stat.value}{stat.suffix}</p>
                <p className="mt-2 text-lg text-[#475569]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        ref={el => sectionRefs.current[3] = el}
        className="pt-8 pb-16 bg-[#F8FAFC] fade-up-element relative" // Added pt-8 for spacing
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <BackgroundDots />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-bold text-[#1E293B] text-center mb-10">Visualizing Our Commitment</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl group cursor-pointer max-w-5xl mx-auto relative aspect-video"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)} // Simpler: always allow !isPlaying to show button
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Added subtle scale on hover
              poster="/standards-bg.jpg" // Ensure path is correct
              loop
              playsInline
              muted // Important for autoplay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/sus.mp4" type="video/mp4" /> {/* Ensure path is correct */}
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 rounded-2xl pointer-events-none group-hover:opacity-80 transition-opacity duration-300"></div>

            {(showControls || !isPlaying) && (
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 flex items-center justify-center"
                style={!isPlaying ? { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } : {}} // Always show if paused and hovered
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;