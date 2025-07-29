import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, ChevronDown, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  origin: string;
  packaging: string[];
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Jaya Rice',
    category: 'Grains & Rice',
    description: 'Premium quality rice varieties and grains from around the world',
    origin: 'India',
    packaging: ['5kg', '10kg', '25kg', 'Custom'],
    image: '/jaya.jpg',
  },
  {
    id: 2,
    name: 'Jaggery',
    category: 'Jaggery Products',
    description: 'Pure and natural jaggery blocks, rich in taste and nutrients',
    origin: 'India',
    packaging: ['5kg', '10kg', '25kg', 'Custom'],
    image: '/jaggery.jpg',
  },
  {
    id: 3,
    name: 'Coconut Oil',
    category: 'Coconut Oils',
    description: 'Pure Kerala coconut oil packed with flavor and nutrition',
    origin: 'Kerala',
    packaging: ['2Ltr', 'Custom'],
    image: '/oil.jpg',
  },
  {
    id: 4,
    name: 'Matta Unda Rice',
    category: 'Grains & Rice',
    description: 'Traditional Kerala red rice, wholesome and full of fiber',
    origin: 'Kerala',
    packaging: ['5kg', '10kg', '25kg', 'Custom'],
    image: '/matta.jpg',
  },
  {
    id: 5,
    name: 'Vadi Matta Rice',
    category: 'Grains & Rice',
    description: 'Soft-textured Kerala rice with rich aroma and nutrition',
    origin: 'Kerala',
    packaging: ['5kg', '10kg', '25kg', 'Custom'],
    image: '/vadi.jpg',
  },
];

const categories = ['All Categories', ...new Set(products.map((p) => p.category))];

const carouselImages = [
  '/jaya.jpg',
  '/jaggery.jpg',
  '/oil.jpg',
  '/matta.jpg',
  '/vadi.jpg'
];

const ProductsPage = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const heroTextRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const productCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Management', path: '/management' },
    { name: 'Contact', path: '/contact' },
  ];

  const goToSlide = (index: number) => {
    const total = carouselImages.length;
    const next = (index + total) % total;
    setCurrentSlide(next);
  };

  // Consolidated carousel interval logic
  useEffect(() => {
    if (slideInterval.current) {
        clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
        }
    };
  }, [currentSlide]); // Resets interval when currentSlide changes (e.g., manual navigation)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
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
        }
      });
    };
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    sectionRefs.current.forEach(section => { if (section) observer.observe(section); });
    productCardRefs.current.forEach(card => { if (card) observer.observe(card); });
    if (filterSectionRef.current) observer.observe(filterSectionRef.current);
    if (ctaSectionRef.current) observer.observe(ctaSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollY = window.scrollY;
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrollY * 0.3}px)`; 
        heroTextRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 300)}`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="pt-0 bg-[#F8FAFC]"> {/* Main background color */}
      <section className="relative h-[480px] md:h-[520px] text-white overflow-hidden">
        <div className="absolute inset-0 rounded-b-[60px] overflow-hidden z-0">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-brightness-75"></div>
            </div>
          ))}
        </div>
        <button
          aria-label="Previous slide"
          className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4FA6F7]/70"
          onClick={() => goToSlide(currentSlide - 1)}
        >
          <ChevronLeft className="text-white" size={28} />
        </button>
        <button
          aria-label="Next slide"
          className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4FA6F7]/70"
          onClick={() => goToSlide(currentSlide + 1)}
        >
          <ChevronRight className="text-white" size={28} />
        </button>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 focus:outline-none ${
                currentSlide === index ? 'bg-white scale-125 ring-2 ring-[#4FA6F7]/70' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <header className={`relative z-30 transition-all duration-300 ${isScrolled ? 'bg-[#2C3E50] shadow-lg' : 'bg-transparent md:bg-[#2C3E50]/70 md:backdrop-blur-sm'}`}>
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
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
                            className={`text-white font-medium relative hover:text-[#4FA6F7] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#4FA6F7] after:transition-all after:duration-300 ${
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
            <div className="md:hidden bg-[#2C3E50]/95 text-white px-4 pb-4 space-y-2 animate-fadeIn"> {/* Changed bg to deep-navy */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 text-lg font-medium transition-colors rounded-md px-3 ${
                    location.pathname === link.path ? 'text-[#4FA6F7] bg-white/10' : 'hover:text-[#4FA6F7] hover:bg-white/5'
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
          className="relative z-10 container mx-auto px-4 md:px-6 mt-16 md:mt-24 text-center will-change-transform"
        >
          <div 
            ref={el => sectionRefs.current[0] = el}
            className="max-w-3xl mx-auto fade-up-element"
            style={{
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s'
            }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 drop-shadow-md">
              Our Product Range
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-sm">
              Discover our extensive selection of premium food products, sourced with care from around the world.
            </p>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-[#4FA6F7] z-10 bg-white/80 rounded-full p-1.5 transition-all duration-200 hover:scale-110"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              <div className="h-64 md:h-80 flex items-center justify-center bg-slate-50 p-6 pt-8 rounded-t-xl"> {/* Light gray bg */}
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="max-h-full w-auto object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="inline-block px-3 py-1 bg-[#4FA6F7]/20 text-[#2563EB] rounded-full text-sm font-semibold mb-4">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-4">{selectedProduct.name}</h2>
                <p className="text-[#1E293B]/90 mb-6 text-base leading-relaxed">{selectedProduct.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-3">Product Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-medium w-28 text-[#1E293B]/80">Origin:</span>
                        <span className="text-[#1E293B]">{selectedProduct.origin}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-[#1E293B]/80">Category:</span>
                        <span className="text-[#1E293B]">{selectedProduct.category}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-[#1E293B]/80">Quality:</span>
                        <span className="text-[#1E293B]">Premium</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-3">Available Packaging</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.packaging.map((pkg, index) => (
                        <span 
                          key={index} 
                          className="inline-block px-3 py-1.5 bg-slate-100 text-[#1E293B] rounded-md text-sm font-medium transition-all duration-300 hover:bg-slate-200 hover:shadow-sm"
                        >
                          {pkg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                  <a 
                    href={`mailto:info@rrbusinessgroup.com?subject=Inquiry about ${selectedProduct.name}`} 
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
                  >
                    Request Quotation
                  </a>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-[#1E293B] font-semibold rounded-lg hover:bg-slate-200 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 border border-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section 
        ref={filterSectionRef}
        className={`py-6 md:py-8 bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-20 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'} fade-up-element`}
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4FA6F7] focus:border-[#4FA6F7] outline-none transition-all duration-300 hover:shadow-sm focus:shadow-md text-[#1E293B] bg-white placeholder-slate-400"
              />
            </div>
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter size={20} className="text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-12 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4FA6F7] focus:border-[#4FA6F7] outline-none appearance-none transition-all duration-300 hover:shadow-sm focus:shadow-md bg-white text-[#1E293B]"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category} className="text-[#1E293B]">{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current[1] = el}
        className="py-12 md:py-16 bg-[#F8FAFC] fade-up-element"
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={el => productCardRefs.current[index] = el}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 cursor-pointer will-change-transform stagger-element border border-slate-200 hover:border-[#4FA6F7]/60"
                  style={{
                    opacity: 0, transform: 'translateY(20px) scale(0.98)',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out',
                  }}
                  data-delay={index % 3}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="h-60 flex items-center justify-center bg-white p-6 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full w-auto object-contain rounded-md transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5 md:p-6">
                    <span className="inline-block px-3 py-1 bg-[#4FA6F7]/10 text-[#2563EB] rounded-full text-xs font-semibold mb-3 transition-all duration-300 group-hover:bg-[#4FA6F7]/20 group-hover:text-[#1D4ED8]">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-semibold text-[#1E293B] mb-2 group-hover:text-[#4FA6F7] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-[#1E293B]/90 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                      <span className="text-xs text-[#1E293B]/70 transition-colors duration-300 group-hover:text-[#1E293B]/90">
                        Origin: {product.origin}
                      </span>
                      <span className="text-[#2563EB] group-hover:text-[#1D4ED8] transition-all duration-300 group-hover:translate-x-1 text-sm font-semibold flex items-center">
                        View Details <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-12 fade-up-element"
              style={{
                opacity: 0, transform: 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              <p className="text-[#1E293B] text-lg mb-6">No products found matching your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Categories');
                }}
                className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section 
        ref={ctaSectionRef}
        className="py-16 md:py-20 bg-slate-100 fade-up-element" /* Changed background */
        style={{
          opacity: 0, transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Need Custom Products or Packaging?</h2>
            <p className="text-[#1E293B]/90 text-lg mb-8">
              We offer customized solutions based on your specific requirements. Get in touch with our team to discuss your needs for products, packaging, or bulk orders.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:info@rrbusinessgroup.com?subject=Custom Product Inquiry" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
              >
                Request a Quote
              </a>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#2563EB] border-2 border-[#2563EB] font-semibold rounded-lg hover:bg-sky-50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global CSS for animations - ensure this is handled correctly for your project (e.g., in a global CSS file if not using Next.js) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;