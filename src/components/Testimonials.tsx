import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Al-Mansouri',
    position: 'Purchasing Manager',
    company: 'AL-SMART Hyper Mart',
    testimonial: 'RR Business Group has been our trusted supplier for over 5 years. Their commitment to quality and on-time delivery has been exceptional. Their range of products meets our diverse needs.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&h=200',
  },
  {
    id: 2,
    name: 'Sarah Khan',
    position: 'Director of Imports',
    company: 'MTC Food Distributors',
    testimonial: 'Working with RR Business Group has transformed our supply chain efficiency. Their product quality is consistent, and they\'ve been responsive to our specific requirements.',
    rating: 5,
    image: 'https://images.pexels.com/photos/5615665/pexels-photo-5615665.jpeg?auto=compress&cs=tinysrgb&h=200',
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    position: 'Product Manager',
    company: 'ElevenHub Food Distributors',
    testimonial: 'The foodstuff products supplied by RR Business Group have helped us expand our market reach significantly. Their global standards compliance makes our job easier.',
    rating: 4,
    image: 'https://images.pexels.com/photos/3785074/pexels-photo-3785074.jpeg?auto=compress&cs=tinysrgb&h=200',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Radial Glow Background */}
      <div className="absolute -top-10 -left-20 w-96 h-96 bg-[#c0392b]/10 rounded-full blur-3xl opacity-40 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-[#4FA6F7]/10 rounded-full blur-3xl opacity-40 animate-pulse-slow pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 text-lg">
            We pride ourselves on building long-term relationships with our clients. Here's what some of them have to say about working with us.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${isAnimating ? 'opacity-70' : 'opacity-100'}`}
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.position}</p>
                        <p className="text-[#c0392b] font-medium">{testimonial.company}</p>
                        <div className="flex items-center justify-center md:justify-start mt-2">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              size={18}
                              className={idx < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 text-lg italic">"{testimonial.testimonial}"</blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === current ? 'bg-[#c0392b]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
