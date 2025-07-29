import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, TrendingUp, Users, Truck, ShieldCheck, Clock, Play, Pause, Menu, X } from 'lucide-react';

const AboutPage = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Video controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Autoplay might not always succeed immediately
  const [showControls, setShowControls] = useState(false);

  // Refs for animation elements
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const valueCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leaderCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Management', path: '/management' },
    { name: 'Contact', path: '/contact' },
  ];

  // Helper function to smoothly transition video volume
  const smoothlySetVolume = useCallback((videoElement: HTMLVideoElement | null, targetVolume: number, duration: number) => {
    if (!videoElement) return;

    const currentVolume = videoElement.volume;
    const isMuted = videoElement.muted;

    if (targetVolume > 0 && isMuted) {
      videoElement.muted = false;
    }

    const existingIntervalId = videoElement.dataset.fadeIntervalId;
    if (existingIntervalId) {
      clearInterval(Number(existingIntervalId));
      delete videoElement.dataset.fadeIntervalId;
    }

    if (currentVolume === targetVolume && videoElement.muted === (targetVolume === 0 && currentVolume === 0)) {
        return;
    }

    const stepTime = 25; // ms per step
    const numSteps = Math.max(1, Math.floor(duration / stepTime));
    const volumeStep = (targetVolume - currentVolume) / numSteps;
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
      let newVolume = currentVolume + volumeStep * currentStep;
      newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp volume between 0 and 1
      videoElement.volume = newVolume;

      if (currentStep >= numSteps) {
        videoElement.volume = targetVolume;
        clearInterval(intervalId);
        delete videoElement.dataset.fadeIntervalId;
      }
    }, stepTime);
    videoElement.dataset.fadeIntervalId = String(intervalId);
  }, []);

  // Video controls: Attempt to autoplay (unmuted)
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = 0;
          await videoRef.current.play();
          setIsPlaying(true);
          setShowControls(false);
        } catch (err) {
          console.error("Autoplay with sound was prevented:", err);
          setIsPlaying(false);
          setShowControls(true);
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
        }
      }
    };
    playVideo();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Video play failed:", err);
          setShowControls(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Intersection Observer for scroll animations and video volume
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        if (entry.isIntersecting) {
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
        }

        if (videoRef.current && sectionRefs.current[1] && element === sectionRefs.current[1]) {
          if (entry.isIntersecting) {
            videoRef.current.muted = false;
            smoothlySetVolume(videoRef.current, 1.0, 500);
          } else {
            smoothlySetVolume(videoRef.current, 0.0, 500);
          }
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const elementsToObserve: (HTMLElement | null)[] = [
      heroTextRef.current,
      ...sectionRefs.current,
      ...valueCardRefs.current,
      ...leaderCardRefs.current,
      ...featureRefs.current
    ].filter(el => el !== null);

    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (videoRef.current && videoRef.current.dataset.fadeIntervalId) {
        clearInterval(Number(videoRef.current.dataset.fadeIntervalId));
      }
    };
  }, [smoothlySetVolume]);

  // Scroll handler for header effect and parallax
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollY = window.scrollY;
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (heroImageRef.current) {
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const values: Array<{ icon: JSX.Element; title: string; description: string; }> = [
    { icon: <ShieldCheck className="h-6 w-6 text-[#2563EB]" />, title: 'Quality Assurance', description: 'We maintain strict quality control measures throughout our supply chain.' },
    { icon: <TrendingUp className="h-6 w-6 text-[#2563EB]" />, title: 'Reliability', description: 'Our commitment to timely delivery and consistent quality builds trust.' },
    { icon: <Users className="h-6 w-6 text-[#2563EB]" />, title: 'Customer Focus', description: 'We prioritize customer needs and strive to exceed expectations.' },
    { icon: <Clock className="h-6 w-6 text-[#2563EB]" />, title: 'Punctuality', description: 'We value your time and ensure prompt delivery of products.' },
    { icon: <FileText className="h-6 w-6 text-[#2563EB]" />, title: 'Compliance', description: 'We adhere to international standards and regulatory requirements.' },
    { icon: <Truck className="h-6 w-6 text-[#2563EB]" />, title: 'Global Reach', description: 'Our extensive network allows us to serve clients worldwide.' }
  ];

  const leaders: Array<{ name: string; position: string; image: string; bio: string; }> = [
    { name: 'JOBY KUNJAPPY JOY', position: 'Director', image: '/cd1.jpeg', bio: 'Joby Kunjappy Joy leads our European operations, driving efficiency and operational excellence throughout the region.' },
    { name: 'ROBIN KUNJAPPY JOY', position: 'Founder', image: '/cd2.jpeg', bio: 'With over 20 years of experience in the food industry, Robin Kunjappy Joy leads the company with vision and strategic insight.' },
    { name: 'ABY KUNJAPPY JOY', position: 'Director', image: '/cd3.jpeg', bio: 'As head of international sales, Aby Kunjappy Joy drives our growth in the Middle East by building strong partnerships and developing new market opportunities.' }
  ];

  const features: Array<{ title: string; description: string; }> = [
    { title: 'Global Footprint', description: 'With a significant global presence, we serve markets worldwide with our diverse food products.' },
    { title: 'Customized Solutions', description: 'We offer tailored solutions designed to meet each client\'s unique requirements and preferences.' },
    { title: 'Commitment to Quality', description: 'We provide only fresh, high-quality food products that meet stringent quality standards.' },
    { title: 'Sustainability Focus', description: 'Our eco-friendly operations and ethical sourcing demonstrate our commitment to sustainability.' },
    { title: 'Client Satisfaction', description: 'We ensure client pleasure through transparency, efficiency, and honesty in all our dealings.' },
    { title: 'Long-term Partnerships', description: 'Our quest for excellence helps us establish enduring bonds with both partners and clients.' }
  ];

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative h-[500px] text-white overflow-hidden">
        <div
          ref={heroImageRef}
          className="absolute inset-0 overflow-hidden rounded-b-[60px] transition-transform duration-1000 will-change-transform"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/abo.webp')",
              backgroundPosition: 'center 30%',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-[#2C3E50]/20 backdrop-brightness-90"></div>
          </div>
        </div>
        <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-[#2C3E50]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-screen-xl mx-auto">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <img
                src="/logo.JPG"
                alt="Logo"
                className="h-12 w-12 object-contain"
                loading="lazy"
              />
              <span className="text-white font-bold text-xl">RR BUSINESS GROUP</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-white font-medium relative hover:text-[#4FA6F7] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#4FA6F7] after:transition-all after:duration-300 ${
                    location.pathname === link.path ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-[#2C3E50]/95 text-white px-4 pb-4 space-y-4 animate-fadeIn shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 text-white font-medium transition-colors ${
                    location.pathname === link.path ? 'text-[#4FA6F7]' : 'hover:text-[#4FA6F7]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </header>
        <div
          ref={heroTextRef}
          className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center h-full transition-transform duration-500 will-change-transform"
        >
          <div
            ref={el => sectionRefs.current[0] = el}
            className="max-w-3xl fade-up-element"
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
              willChange: 'transform, opacity'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6 leading-tight">About RR Business Group</h1>
            <p className="text-xl text-gray-200">
              A trusted name in the foodstuff trading industry, committed to quality, reliability, and customer satisfaction since 2009.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        ref={el => sectionRefs.current[1] = el}
        className="py-16 bg-[#F8FAFC] fade-up-element"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1E293B] mb-6">Our Story</h2>
              <p className="text-[#1E293B] mb-6">
                Established in 2009, RR Business Group has become a global leader in the food supply chain industry, renowned for its commitment to quality, innovation, and client satisfaction. With a strong foundation built on integrity, transparency, and operational excellence, we specialize in sourcing and delivering high-quality, fresh, and diverse food products to markets worldwide.
              </p>
              <p className="text-[#1E293B] mb-6">
                Our journey began with a singular vision — to connect global markets with superior food solutions. Over the years, we have cultivated a robust international network that allows us to serve a wide spectrum of clients, including retail giants, wholesale distributors, and specialized niche markets. Each solution is thoughtfully tailored to meet the unique needs of our partners, ensuring maximum efficiency, adaptability, and long-term growth.
              </p>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg aspect-video group cursor-pointer"
              onMouseEnter={() => !isPlaying && setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
              onClick={togglePlay}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  poster="/quality-bg.jpg"
                  loop
                  playsInline
                  onPlay={() => { setIsPlaying(true); setShowControls(false); }}
                  onPause={() => { setIsPlaying(false); setShowControls(true); }}
                >
                  <source src="/ab.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl pointer-events-none"></div>
                {(showControls || !isPlaying) && (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-200 flex items-center justify-center z-10"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section
        ref={el => sectionRefs.current[2] = el}
        className="py-16 bg-white fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Our Vision</h3>
              <p className="text-[#1E293B] mb-4">
                To become a global leader in the foodstuff trading industry.
              </p>
              <p className="text-[#1E293B]">
                We envision making high-quality food accessible to all—while supporting communities in need through our ongoing charity initiatives.
              </p>
              <div className="mt-6 h-1 w-24 bg-[#2563EB] rounded"></div>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Our Mission</h3>
              <p className="text-[#1E293B] mb-4">
                To provide premium quality food products to global markets.
              </p>
              <p className="text-[#1E293B]">
                We are committed to building lasting partnerships based on trust, integrity, and mutual respect.
              </p>
              <div className="mt-6 h-1 w-24 bg-[#2563EB] rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section
        ref={el => sectionRefs.current[3] = el}
        className="py-16 bg-[#F8FAFC] fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Our Core Values</h2>
            <p className="text-[#1E293B] text-lg">
              Our values guide everything we do and reflect our commitment to excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                ref={el => valueCardRefs.current[index] = el}
                className="bg-white rounded-lg p-6 hover:shadow-xl transition-all duration-300 stagger-element group"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.98)',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out',
                  willChange: 'transform, opacity'
                }}
                data-delay={index % 3}
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[#4FA6F7]/10 mb-4 transition-all duration-300 group-hover:bg-[#4FA6F7]/20 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors duration-300">{value.title}</h3>
                <p className="text-[#1E293B]/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section
        ref={el => sectionRefs.current[4] = el}
        className="py-16 bg-white fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Leadership Team</h2>
            <p className="text-[#1E293B] text-lg">
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
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out',
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
                  <p className="text-[#1E293B]/80 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        ref={el => sectionRefs.current[5] = el}
        className="py-16 bg-[#F8FAFC] fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Why Choose Us?</h2>
            <p className="text-[#1E293B] text-lg">
              At RR Business Group, we are dedicated to providing the retail, wholesale, and specialty markets with fresh, high-quality, and varied food products.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <p className="text-[#1E293B] mb-6">
                With a significant global footprint, we offer customized solutions made to fit each individual's demands while guaranteeing client pleasure through openness, effectiveness, and honesty.
              </p>
              <p className="text-[#1E293B] mb-6">
                Our eco-friendly operations and ethical sourcing demonstrate our commitment to sustainability, and our quest for excellence helps us establish enduring bonds with both partners and clients.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
              <img
                src="/standards-bg.webp"
                alt="Our Commitment to Standards"
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
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 stagger-element"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.98)',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out',
                  willChange: 'transform, opacity'
                }}
                data-delay={index % 3}
              >
                <div className="flex items-center mb-4">
                  <div className="w-1.5 h-8 bg-[#2563EB] rounded-full mr-4"></div>
                  <h3 className="text-xl font-semibold text-[#1E293B]">{feature.title}</h3>
                </div>
                <p className="text-[#1E293B]/80 pl-6">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={el => sectionRefs.current[6] = el}
        className="py-16 bg-gradient-to-r from-[#4FA6F7]/10 to-[#2563EB]/10 fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Want to Know More?</h2>
            <p className="text-[#1E293B]/80 text-lg mb-8">
              Our team is ready to answer your questions and discuss how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-medium rounded-xl hover:bg-[#1E40AF] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                Contact Us
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2563EB] border border-[#2563EB] font-medium rounded-xl hover:bg-[#F8FAFC] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;