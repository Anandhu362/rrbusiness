import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Jaya Rice',
    description: 'Premium quality rice varieties and grains from around the world',
    image: '/jaya.jpg',
    slug: 'grains-rice',
  },
  {
    id: 2,
    name: 'Jaggery',
    description: 'Pure and natural jaggery blocks, rich in taste and nutrients',
    image: '/jaggery.jpg',
    slug: 'grains-rice',
  },
  {
    id: 3,
    name: 'Coconut Oil',
    description: 'Pure Kerala coconut oil for cooking, rich in aroma and nutrition',
    image: '/oil.jpg',
    slug: 'grains-rice',
  },
  {
    id: 4,
    name: 'Matta Unda Rice',
    description: 'Traditional Kerala red rice, wholesome and full of fiber',
    image: '/matta.jpg',
    slug: 'grains-rice',
  },
  {
    id: 5,
    name: 'Vadi Matta Rice',
    description: 'Soft-textured Kerala rice with rich aroma and nutrition',
    image: '/vadi.jpg',
    slug: 'grains-rice',
  },
];

const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    } 
  },
};

const cardHover = {
  scale: 1.02,
  transition: {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1]
  }
};

const imageHover = {
  scale: 1.05,
  transition: {
    duration: 0.6,
    ease: [0.33, 1, 0.68, 1]
  }
};

const ProductCategories = () => {
  return (
    <section className="py-20 bg-[#F8FAFC] font-sans overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header with animation */}
        <FadeInOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold text-[#1E293B] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our Product Categories
            </motion.h2>
            <motion.p 
              className="text-[#64748B] text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              We offer a wide range of high-quality food products to meet diverse consumer needs across global markets.
            </motion.p>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <FadeInOnScroll key={category.id} delay={idx * 0.1}>
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                whileHover={cardHover}
                initial="hidden"
                animate="visible"
              >
                {/* Image Section */}
                <div className="pt-8 px-8">
                  <motion.div 
                    className="h-56 flex items-center justify-center p-4 overflow-hidden"
                    whileHover={imageHover}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-h-52 object-contain rounded-lg transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
                {/* Content Section */}
                <div className="p-8 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E293B] font-heading group-hover:text-[#2563EB] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#64748B] mt-2">{category.description}</p>
                  </div>
                  {/* Button */}
                  <Link
                    to={`/products#${category.slug}`}
                    className="inline-flex items-center text-[#2563EB] font-medium hover:text-[#1E40AF] transition-colors duration-300 group"
                  >
                    <span>View Products</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <ChevronRight size={16} className="ml-1" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </FadeInOnScroll>
          ))}
        </div>

        {/* View All CTA */}
        <FadeInOnScroll delay={0.4}>
          <div className="text-center mt-16">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2563EB] text-white font-heading rounded-lg hover:bg-[#1E40AF] transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                View All Products
              </Link>
            </motion.div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

// Enhanced FadeInOnScroll component
function FadeInOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: '-50px',
    amount: 0.1
  });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      custom={delay}
      transition={{
        delay: delay,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

export default ProductCategories;