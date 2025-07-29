import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, Users, Award, Lightbulb, 
    Play, Pause, Menu, X, 
    Factory, Globe, TrendingUp, Sparkles // Icons for roadmap
    // Removed Volume2, VolumeX as the explicit toggle is removed
} from 'lucide-react';
import { motion } from 'framer-motion';

const ManagementPage = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null); // Ref for the video's immediate container
  const [isPlaying, setIsPlaying] = useState(false); 
  const [showControls, setShowControls] = useState(false);
  // isMuted state is removed
  
  const heroTextContainerRef = useRef<HTMLDivElement>(null);
  const heroTextContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const valueCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leaderCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const roadmapSectionRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Management', path: '/management' },
    { name: 'Contact', path: '/contact' },
  ];

  // Autoplay Effect
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = true; // Crucial: Start muted for autoplay
          await videoRef.current.play();
          // isPlaying state will be updated by onPlay event
        } catch (err) {
          console.error("Autoplay was prevented:", err);
          setShowControls(true); 
        }
      }
    };
    playVideo();
  }, []);

  // Scroll-based audio fade effect
  useEffect(() => {
    const videoElement = videoRef.current;
    const containerElement = videoContainerRef.current;

    if (!videoElement || !containerElement) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!videoElement) return;

      const visibility = entry.intersectionRatio;

      // If user manually paused, or video ended, ensure it's muted and do nothing more with volume.
      if (videoElement.paused || videoElement.ended) {
        if (!videoElement.muted) {
          videoElement.muted = true;
        }
        return;
      }

      // Video is supposed to be playing
      if (entry.isIntersecting && visibility > 0.1) { // More than 10% visible
        if (videoElement.muted) {
          videoElement.muted = false; // Unmute
        }
        // Adjust volume based on visibility (e.g., square of visibility for smoother fade)
        videoElement.volume = Math.max(0, Math.min(1, Math.pow(visibility, 2)));
      } else {
        // Not intersecting enough or not at all, mute it.
        if (!videoElement.muted) {
          videoElement.muted = true;
        }
      }
    };

    // Create thresholds for smoother updates (e.g., every 1% change in visibility)
    const thresholds = Array.from({ length: 101 }, (_, i) => i * 0.01);

    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: thresholds,
    });

    observer.observe(containerElement);

    return () => {
      if (containerElement) {
        observer.unobserve(containerElement);
      }
      // Optionally re-mute when component unmounts or effect cleans up
      // if (videoElement && !videoElement.muted) {
      //   videoElement.muted = true;
      // }
    };
  }, []); // Runs once on mount and when refs are available

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().catch(err => {
          console.error("Video play failed:", err);
          setShowControls(true); 
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  // toggleMute function is removed

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const animateOnScroll = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
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
          observer.unobserve(element);
        }
      });
    };
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const elementsToObserve: (HTMLElement | null)[] = [
      heroTextContentRef.current,
      ...sectionRefs.current.filter(el => el !== null),
      ...valueCardRefs.current.filter(el => el !== null),
      ...leaderCardRefs.current.filter(el => el !== null), 
      ...featureRefs.current.filter(el => el !== null),
      roadmapSectionRef.current
    ].filter(el => el !== null);
    elementsToObserve.forEach(el => { if (el) observer.observe(el); });
    return () => {
      elementsToObserve.forEach(el => { if (el) observer.unobserve(el); });
      observer.disconnect();
    }
  }, []); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollY = window.scrollY;
      if (heroTextContainerRef.current) {
        heroTextContainerRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (heroImageRef.current) {
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const values = [
    { icon: ShieldCheck, title: 'Integrity', description: 'We uphold the highest standards of honesty and ethical conduct in all our dealings.' },
    { icon: Award, title: 'Excellence', description: 'We strive for superior performance and continuous improvement in everything we do.' },
    { icon: Lightbulb, title: 'Innovation', description: 'We embrace creativity and forward-thinking to drive sustainable growth.' },
    { icon: Users, title: 'Collaboration', description: 'We believe in teamwork and building strong relationships with all stakeholders.' }
  ];

  const leaders = [
    { name: 'JOBY KUNJAPPY JOY', position: 'Director', image: '/cd1.jpeg', bio: 'Joby Kunjappy Joy leads our European operations, driving efficiency and operational excellence throughout the region.' },
    { name: 'ROBIN KUNJAPPY JOY', position: 'Founder', image: '/cd2.jpeg', bio: 'With over 20 years of experience in the food industry, Robin Kunjappy Joy leads the company with vision and strategic insight.' },
    { name: 'ABY KUNJAPPY JOY', position: 'Director', image: '/cd3.jpeg', bio: 'As head of international sales, Aby Kunjappy Joy drives our growth in the Middle East by building strong partnerships and developing new market opportunities.' }
  ];

  const features = [
    { title: 'Strategic Vision', description: 'Our leadership team develops long-term strategies that drive sustainable growth and market leadership.' },
    { title: 'Operational Excellence', description: 'We implement best practices to ensure efficiency and quality across all operations.' },
    { title: 'Talent Development', description: 'We invest in our people, fostering a culture of learning and professional growth.' },
    { title: 'Stakeholder Engagement', description: 'We maintain open communication with all stakeholders to build trust and alignment.' },
    { title: 'Risk Management', description: 'We proactively identify and mitigate risks to ensure business continuity.' },
    { title: 'Innovation Culture', description: 'We encourage creative thinking and embrace new technologies to stay ahead.' }
  ];

  const roadmap = [
    { year: "2009", title: "Company Founded", description: "RR Business Group was established with a vision to revolutionize food distribution globally.", icon: Factory },
    { year: "2013", title: "International Expansion", description: "Entered international markets, partnering with key distributors across the Middle East and Asia.", icon: Globe },
    { year: "2017", title: "Team Growth", description: "Expanded our workforce and created local employment opportunities in key markets.", icon: Users },
    { year: "2021", title: "Sustainability Milestone", description: "Launched initiatives in eco-friendly packaging, ethical sourcing, and carbon-neutral logistics.", icon: TrendingUp },
    { year: "2025+", title: "Future Vision", description: "Aiming to establish R&D labs and community programs while expanding our global footprint.", icon: Sparkles },
  ];

  return (
    <div className="pt-0 bg-gray-50">
      <section className="relative h-[500px] text-white overflow-hidden">
        <div
          ref={heroImageRef}
          className="absolute inset-0 overflow-hidden rounded-b-[60px] will-change-transform"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/management.jpeg')",
              backgroundPosition: 'center 20%',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-[#2C3E50]/20 backdrop-brightness-75"></div>
          </div>
        </div>

        <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-[#2C3E50]/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-4'}`}>
          <div className="flex items-center justify-between px-4 md:px-6 max-w-screen-xl mx-auto">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <img src="/logo.JPG" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" loading="lazy" />
              <span className="text-white font-bold text-lg md:text-xl">RR BUSINESS GROUP</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-white font-medium text-sm lg:text-base relative hover:text-[#4FA6F7] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#4FA6F7] after:transition-all after:duration-300 ${
                    location.pathname === link.path ? 'after:w-full text-[#4FA6F7]' : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none p-2" aria-label="Toggle menu">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-[#2C3E50]/95 text-white px-4 pb-4 space-y-1 pt-2 animate-fadeIn shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 px-3 text-base text-white font-medium transition-colors rounded-md ${
                    location.pathname === link.path ? 'text-[#4FA6F7] bg-white/10' : 'hover:text-[#4FA6F7] hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </header>
        
        <div style={{ height: '72px' }}></div>

        <div 
          ref={heroTextContainerRef}
          className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center h-[calc(100%-72px)]"
          style={{paddingBottom: '4rem'}} 
        >
          <div 
            ref={heroTextContentRef}
            className="max-w-3xl fade-up-element"
            style={{
              opacity: 0,
              transform: 'translateY(30px)', 
              transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
              willChange: 'transform, opacity'
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 mb-6 leading-tight drop-shadow-lg">Leadership with Vision</h1>
            <p className="text-lg sm:text-xl text-gray-200 drop-shadow-md">
              Meet the experienced professionals who guide RR Business Group with expertise and strategic insight.
            </p>
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current[0] = el}
        className="py-16 md:py-20 bg-[#F8FAFC] fade-up-element"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity'}}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-6">Guided by Purpose, Powered by People</h2>
              <p className="text-lg text-[#334155] mb-6 leading-relaxed">
                Our leadership philosophy is centered on people. We believe that empowering individuals with integrity, vision, and accountability creates lasting impact.
              </p>
              <p className="text-lg text-[#334155] mb-6 leading-relaxed">
                At RR Business Group, we combine strategic thinking with operational excellence to drive sustainable growth and create value for all stakeholders.
              </p>
            </div>
            <div 
              ref={videoContainerRef} // Added ref to the video container
              className="relative rounded-2xl overflow-hidden shadow-xl aspect-video group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
                poster="/management-video-poster.jpg"
                loop
                playsInline
                // `muted` attribute is controlled by useEffects now
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay} 
              >
                <source src="/ma.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 rounded-2xl pointer-events-none"></div>
              
              {/* Play/Pause Button Container (Mute button removed) */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3 z-10 transition-opacity duration-300 ${(showControls || !isPlaying) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); togglePlay(); }}
                  className="bg-black/60 text-white p-3 sm:p-4 rounded-full hover:bg-black/80 transition-all duration-200 flex items-center justify-center"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause size={28} className="sm:h-8 sm:w-8" /> : <Play size={28} className="ml-1 sm:h-8 sm:w-8" />}
                </button>
                {/* Mute/Unmute button is removed */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ... rest of the sections remain unchanged ... */}
      <section 
        ref={el => sectionRefs.current[1] = el}
        className="py-16 md:py-20 bg-white fade-up-element"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Our Leadership Values</h2>
            <p className="text-lg text-[#334155]">
              These core principles guide every decision and action of our leadership team.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                ref={el => valueCardRefs.current[index] = el}
                className="bg-[#F8FAFC] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out stagger-element group transform hover:-translate-y-2"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.98)', willChange: 'transform, opacity, box-shadow' }}
                data-delay={index % 4} 
              >
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-[#4FA6F7]/10 mb-6 transition-all duration-300 group-hover:bg-[#4FA6F7]/20 group-hover:scale-110">
                  <value.icon className="h-8 w-8 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3 group-hover:text-[#2563EB] transition-colors duration-300">{value.title}</h3>
                <p className="text-[#334155]/90 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={roadmapSectionRef}
        className="relative py-16 md:py-20 bg-white fade-up-element"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s', willChange: 'transform, opacity' }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] text-center mb-16">Our Journey & Future Milestones</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute top-0 bottom-0 left-5 md:left-6 w-1 bg-[#2563EB]/20 rounded-full"></div>
            {roadmap.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.25, ease: "easeOut" }}
                  className="mb-12 pl-16 md:pl-20 relative"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.25 + 0.1 }}
                    className="absolute -left-0 top-0 bg-white border-2 border-[#2563EB] text-[#2563EB] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg"
                  >
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                  <h4 className="text-2xl font-semibold text-[#2563EB] mb-1.5 pt-1">{item.year}</h4>
                  <h5 className="text-xl font-medium text-[#1E293B] mb-2">{item.title}</h5>
                  <p className="text-[#334155]/90 text-base leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current[2] = el} 
        className="py-16 md:py-20 bg-white fade-up-element" 
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16"> 
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Executive Leadership</h2> 
            <p className="text-lg text-[#334155]"> 
              Meet the experienced professionals who lead RR Business Group with expertise and vision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((member, index) => (
              <div
                key={member.name}
                ref={el => leaderCardRefs.current[index] = el}
                className="bg-[#F8FAFC] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 stagger-element"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.98)',
                  willChange: 'transform, opacity'
                }}
                data-delay={index % 3}
              >
                <div className="h-64 bg-white flex items-center justify-center p-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-[#1E293B] mb-1">{member.name}</h3>
                  <p className="text-[#2563EB] font-medium mb-3">{member.position}</p>
                  <p className="text-[#334155]/80 text-sm leading-relaxed">{member.bio}</p> 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current[3] = el}
        className="py-16 md:py-20 bg-white fade-up-element"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Governance & Strategic Approach</h2>
            <p className="text-lg text-[#334155]">
              Our leadership drives responsible growth by embracing modern practices and transparent systems.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="order-2 lg:order-1">
              <p className="text-lg text-[#334155] mb-6 leading-relaxed">
                We maintain robust governance frameworks that ensure accountability, transparency, and ethical conduct at all levels of the organization.
              </p>
              <p className="text-lg text-[#334155] mb-6 leading-relaxed">
                Our strategic approach combines long-term vision with agile execution, allowing us to adapt to changing market conditions while staying true to our core mission.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 md:h-96 order-1 lg:order-2">
              <img 
                src="/gov.jpg" 
                alt="Governance and Strategy"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                ref={el => featureRefs.current[index] = el}
                className="bg-[#F8FAFC] rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out stagger-element group transform hover:-translate-y-2"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.98)', willChange: 'transform, opacity, box-shadow' }}
                data-delay={index % 3}
              >
                <div className="flex items-center mb-4">
                  <div className="w-1.5 h-8 bg-[#2563EB] rounded-full mr-4 group-hover:bg-[#1E40AF] transition-colors duration-300"></div>
                  <h3 className="text-xl font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors duration-300">{feature.title}</h3>
                </div>
                <p className="text-[#334155]/90 pl-[calc(0.375rem+1rem)] leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current[4] = el}
        className="py-16 md:py-20 bg-gradient-to-r from-[#4FA6F7]/10 to-[#2563EB]/10 fade-up-element"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', willChange: 'transform, opacity' }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Connect with Our Leadership</h2>
            <p className="text-lg text-[#334155]/90 mb-8">
              Our executive team is available to discuss partnerships, investments, and strategic opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 w-full sm:w-auto"
              >
                Contact Leadership
              </Link>
              <Link
                to="/about" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#2563EB] border-2 border-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1 w-full sm:w-auto"
              >
                Learn About Our Company
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagementPage;