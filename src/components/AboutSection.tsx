import React from 'react';
import {
  Check,
  TrendingUp,
  ShieldCheck,
  Globe,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: TrendingUp,
    title: 'Quality Assurance',
    description: 'We maintain strict quality control measures for all our products.',
    bgImage: '/quality-bg.webp',
    fallback: '/quality-bg.jpg',
  },
  {
    icon: ShieldCheck,
    title: 'Global Standards',
    description: 'Our products comply with international food safety standards.',
    bgImage: '/standards-bg.webp',
    fallback: '/standards-bg.jpg',
  },
  {
    icon: Globe,
    title: 'Global Distribution',
    description: 'We export to markets across Asia, Africa, Europe, and the Americas.',
    bgImage: '/distribution-bg.webp',
    fallback: '/distribution-bg.jpg',
  },
  {
    icon: Truck,
    title: 'Reliable Logistics',
    description: 'Efficient supply chain ensuring timely delivery worldwide.',
    bgImage: '/logistics-bg.webp',
    fallback: '/logistics-bg.jpg',
  },
];

const uspItems = [
  'Premium quality products',
  'Global sourcing network',
  'Certified supply chain',
  'Customized solutions',
];

const baseDelay = 0.2;

const AboutSection = () => {
  // Section reveal on scroll
  const { ref: sectionRef, inView: sectionVisible } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-[#F8FAFC] font-sans overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2
              className={`text-3xl md:text-4xl font-heading font-bold text-[#1E293B] mb-6 transition-all duration-700 ease-out
              ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${baseDelay}s` }}
            >
              About RR Business Group
            </h2>
            <p
              className={`text-[#1E293B] text-lg mb-6 leading-relaxed transition-all duration-700 ease-out
              ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${baseDelay + 0.15}s` }}
            >
              RR Business Group is a trusted name in the foodstuff trading industry in India and Dubai 
              specializing in sourcing, distributing, and supplying high-quality food products 
              to global markets.
            </p>
            <p
              className={`text-[#1E293B] mb-8 leading-relaxed transition-all duration-700 ease-out
              ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${baseDelay + 0.3}s` }}
            >
              As a dedicated exporter of Fast-Moving Consumer Goods (FMCG), we focus on quality, 
              reliability, and customer satisfaction. Our mission is to build lasting partnerships 
              while catering to diverse consumer needs with excellence and professionalism.
            </p>
            <ul className="space-y-4 mb-10">
              {uspItems.map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-start transition-all duration-700 ease-out
                    ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{
                    transitionDelay: `${baseDelay + 0.45 + idx * 0.1}s`,
                  }}
                >
                  <Check className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-[#1E293B] text-base">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className={`inline-flex items-center justify-center px-8 py-3.5 bg-[#2563EB] text-white font-heading rounded-md hover:bg-[#1E40AF] transition-all duration-300 ease-in-out transform hover:scale-105 group
                transition-all duration-700 ease-out
                ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{
                transitionDelay: `${baseDelay + 0.45 + uspItems.length * 0.1 + 0.1}s`,
              }}
            >
              Learn More About Us
              <ChevronRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                // Each card has its own intersection observer for scroll animation
                const { ref, inView } = useInView({
                  threshold: 0.17,
                  triggerOnce: true,
                });
                return (
                  <div
                    key={idx}
                    ref={ref}
                    className={`relative p-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full min-h-[220px] group
                      transform hover:-translate-y-1.5 hover:scale-[1.02]
                      ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                      transition-all duration-700 ease-out`}
                    style={{
                      transitionDelay: `${baseDelay + 0.3 + idx * 0.18}s`,
                    }}
                  >
                    <picture>
                      <source srcSet={feature.bgImage} type="image/webp" />
                      <img
                        src={feature.fallback}
                        alt={feature.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        style={{ filter: 'brightness(0.7)' }}
                        draggable={false}
                      />
                    </picture>
                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                      <div>
                        <div className="mb-4 p-3 bg-white/25 rounded-full inline-block group-hover:bg-white/35 transition-colors duration-300">
                          {React.createElement(feature.icon, {
                            className:
                              'h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110',
                          })}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 font-heading">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-50 text-sm flex-grow">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decorative Blobs */}
            <div className="hidden lg:block absolute -left-10 -bottom-10 w-64 h-64 bg-[#4FA6F7]/10 rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
            <div className="hidden lg:block absolute -right-12 -top-12 w-56 h-56 bg-[#2563EB]/5 rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
