import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Imports Tippy.js default styles
import 'tippy.js/themes/translucent.css'; // Import a Tippy.js theme (optional, if you use it)


const GlobalReach = () => {
  const regions = [
    {
      name: 'Middle East',
      countries: [
        { name: 'UAE', countryCode: 'ae', note: 'Dubai, Abu Dhabi' },
        { name: 'Saudi Arabia', countryCode: 'sa', note: 'Riyadh, Jeddah' },
        { name: 'Qatar', countryCode: 'qa', note: 'Doha' },
        { name: 'Oman', countryCode: 'om', note: 'Muscat' },
        { name: 'Kuwait', countryCode: 'kw', note: 'Kuwait City' },
        { name: 'Bahrain', countryCode: 'bh', note: 'Manama' }
      ],
      color: 'bg-blue-600',
      textColor: 'text-blue-500' // Added for MapPin consistency
    },
    {
      name: 'Asia',
      countries: [
        { name: 'India', countryCode: 'in', note: 'Pan India Export' },
        { name: 'Bangladesh', countryCode: 'bd', note: 'Dhaka' },
        { name: 'Sri Lanka', countryCode: 'lk', note: 'Colombo' },
        { name: 'Malaysia', countryCode: 'my', note: 'Kuala Lumpur' },
        { name: 'Singapore', countryCode: 'sg', note: 'Central Singapore' }
      ],
      color: 'bg-green-600',
      textColor: 'text-green-500' // Added for MapPin consistency
    },
    {
      name: 'Europe',
      countries: [
        { name: 'United Kingdom', countryCode: 'gb', note: 'London, Manchester' },
        { name: 'Germany', countryCode: 'de', note: 'Berlin, Hamburg' },
        { name: 'France', countryCode: 'fr', note: 'Paris, Lyon' },
        { name: 'Italy', countryCode: 'it', note: 'Rome, Milan' },
        { name: 'Spain', countryCode: 'es', note: 'Madrid, Barcelona' },
        { name: 'Netherlands', countryCode: 'nl', note: 'Amsterdam, Rotterdam' }
      ],
      color: 'bg-red-600',
      textColor: 'text-red-500' // Added for MapPin consistency
    }
  ];

  // Function to generate flag URL
  const getFlagUrl = (countryCode: string) => `https://flagcdn.com/${countryCode}.svg`;

  return (
    <section className="py-16 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Our Global Reach
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300 text-lg leading-relaxed"
          >
            We export premium food products to over 30 countries across multiple continents, building strong partnerships with distributors worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {regions.map((region, regionIndex) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: regionIndex * 0.15, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 ease-in-out"
            >
              <div className={`w-16 h-1.5 ${region.color} mb-5 rounded-full`}></div>
              <h3 className="text-2xl font-semibold mb-5 text-white">{region.name}</h3>
              <ul className="space-y-2.5">
                {region.countries.map((country, countryIndex) => (
                  <motion.li
                    key={country.name}
                    className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: countryIndex * 0.05 + regionIndex * 0.1 }} 
                    viewport={{ once: true }}
                  >
                    <MapPin size={18} className={`mr-2.5 ${region.textColor || 'text-gray-400'}`} />
                    <Tippy 
                        content={<span className="text-xs p-1">{country.note}</span>} 
                        delay={[100, 0]}
                        placement="top"
                        animation="shift-away"
                        theme="translucent" // Make sure to import 'tippy.js/themes/translucent.css' or your custom theme
                    >
                      <div className="flex items-center gap-2 cursor-default">
                        <img 
                            src={getFlagUrl(country.countryCode)} 
                            alt={`${country.name} flag`} 
                            className="w-5 h-auto rounded-sm border border-gray-600" 
                            loading="lazy"
                        />
                        <span className="text-sm font-medium">{country.name}</span>
                      </div>
                    </Tippy>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;