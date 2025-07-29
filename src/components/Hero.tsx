import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  // heroRef is for the main section container, if needed for other purposes
  // const heroSectionRef = useRef<HTMLDivElement | null>(null); 
  // heroContentRef is for applying parallax to the text content
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        const scrollPosition = window.scrollY;
        // Parallax effect for the content: moves up slower than scroll, fades out
        heroContentRef.current.style.transform = `translateY(${scrollPosition * 0.3}px)`; 
        heroContentRef.current.style.opacity = `${Math.max(0, 1 - scrollPosition / 400)}`; // Fades out as user scrolls down
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set position if page is already scrolled

    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    // The main hero container, heroSectionRef could be attached here if needed for its own animations
    <div className="relative h-screen overflow-hidden font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline // Essential for autoplay on mobile browsers
        className="absolute top-0 left-0 w-full h-full object-cover z-0" // z-0 to be behind content
        poster="/fallback-hero-image.jpg" // Optional: Poster image for while video loads or if it fails
      >
        <source src="/hvid.webm" type="video/webm" />
        Your browser does not support the video tag. Consider using a modern browser.
      </video>

      {/* Content Overlay: Darkens the video for text readability */}
      <div className="absolute inset-0 bg-[#2C3E50]/10 z-[1]"></div> {/* Adjusted opacity, z-index */}

      {/* Foreground Content with Parallax */}
      <div 
        ref={heroContentRef} // Ref for applying parallax transform to this content block
        className="relative z-[2] h-full flex items-center justify-center text-center md:text-left" // Centered content
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl md:max-w-3xl mx-auto md:mx-0"> {/* Max width for content, centered on mobile, left on md+ */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Premium Foodstuff <span className="text-[#4FA6F7]">Trading</span> <br /> and Global Distribution
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              RR Business Group is a trusted name in the foodstuff industry, specializing in sourcing,
              distributing, and supplying high-quality food products worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1E40AF] transition-all duration-300 ease-in-out group shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4FA6F7] focus:ring-offset-2 focus:ring-offset-[#2C3E50]/50"
              >
                Explore Our Products
                <ArrowRight className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1.5" size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/80 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2C3E50]/50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade Gradient: Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-[3]"></div>
    </div>
  );
};

export default Hero;