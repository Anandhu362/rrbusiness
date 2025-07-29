import React from 'react';
import { ShieldCheck, BadgeCheck as CertificateIcon, ClipboardCheck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider, { Settings as SliderSettings, CustomArrowProps } from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Placeholder images - IMPORTANT: Replace these with your actual image paths in the /public folder
const qualityImages: string[] = [
  '/cq.jpg',             // Assumed to be in /public/cq.jpg
  '/quality-bg.jpg',     // Assumed to be in /public/quality-bg.jpg
  '/product.jpg'         // Assumed to be in /public/product.jpg
];

// Custom Arrow Components
const CustomPrevArrow: React.FC<CustomArrowProps> = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`custom-slick-arrow custom-slick-prev ${className?.includes('slick-disabled') ? 'slick-disabled' : ''}`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous"
      type="button"
    >
      <ChevronLeft size={28} className="text-white" />
    </button>
  );
};

const CustomNextArrow: React.FC<CustomArrowProps> = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`custom-slick-arrow custom-slick-next ${className?.includes('slick-disabled') ? 'slick-disabled' : ''}`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next"
      type="button"
    >
      <ChevronRight size={28} className="text-white" />
    </button>
  );
};


const QualityAssurance: React.FC = () => {
  const certifications = [
    {
      icon: <ShieldCheck className="h-12 w-12 text-[#2563EB]" />,
      title: 'ISO 22000',
      description: 'Food Safety Management System certification ensuring our products meet international safety standards.'
    },
    {
      icon: <CertificateIcon className="h-12 w-12 text-[#2563EB]" />,
      title: 'HACCP Certified',
      description: 'Hazard Analysis Critical Control Point certification for systematic preventive approach to food safety.'
    },
    {
      icon: <ClipboardCheck className="h-12 w-12 text-[#2563EB]" />,
      title: 'GMP Compliant',
      description: 'Good Manufacturing Practices ensuring products are consistently produced according to quality standards.'
    },
    {
      icon: <Award className="h-12 w-12 text-[#2563EB]" />,
      title: 'Halal Certified',
      description: 'Certification ensuring products meet Islamic dietary laws and are suitable for Muslim consumption.'
    }
  ];

  const sliderSettings: SliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    adaptiveHeight: false, // With a fixed aspect ratio container, adaptiveHeight is less critical
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    draggable: true,
  };

  return (
    <section className="py-16 bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-50 to-[#F8FAFC]"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-100/20 -z-10 opacity-50"></div>
      <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full bg-[#4FA6F7]/10 -z-10 opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#1E293B] mb-4">Our Quality Assurance</h2>
          <p className="text-[#475569] text-lg">
            At RR Business Group, quality is our top priority. We adhere to the strictest international standards to ensure the highest quality foodstuff products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert) => (
            <div 
              key={cert.title}
              className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="inline-flex items-center justify-center mb-5 p-3 bg-[#E0E7FF] rounded-full">
                {React.cloneElement(cert.icon as React.ReactElement, { className: "h-10 w-10 text-[#2563EB]" })}
              </div>
              <h3 className="text-xl font-semibold font-heading text-[#1E293B] mb-3">{cert.title}</h3>
              <p className="text-[#475569] text-sm leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>

        {/* Quality Control Process Block */}
        <div className="mt-16 md:mt-20 bg-[#2563EB] text-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Text Content Column */}
            <div className="p-8 md:p-12 flex flex-col justify-center"> {/* This column's height will influence the row height */}
              <h3 className="text-2xl lg:text-3xl font-bold font-heading mb-6">Our Quality Control Process</h3>
              <p className="mb-8 text-blue-100 leading-relaxed text-opacity-90">
                We implement a rigorous quality control process at every stage of our supply chain to ensure only the finest products reach our customers.
              </p>
              <div className="space-y-5">
                {[
                  'Supplier Selection and Verification',
                  'Raw Material Testing and Inspection',
                  'Processing and Packaging Standards',
                  'Final Product Testing',
                  'Storage and Distribution Control',
                  'Regular Quality Audits'
                ].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white text-[#2563EB] flex items-center justify-center mr-4 font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-white font-medium text-base">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Carousel Grid Cell - This cell will be as tall as the text column */}
            {/* We make this cell a flex container to center the carousel wrapper */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8"> 
              {/* Carousel Wrapper - This will have a defined aspect ratio and max width */}
              <div className="w-full max-w-xl aspect-[16/10] quality-carousel-container relative rounded-xl overflow-hidden shadow-lg"> 
                {/* Using aspect-ratio tailwind classes like aspect-video (16/9) or aspect-square, or custom via aspect-[16/10] */}
                {/* The rounded-xl and overflow-hidden on this wrapper will clip the fading slides. */}
                <Slider {...sliderSettings}>
                  {qualityImages.map((imgSrc, index) => (
                    <div key={imgSrc || index} className="h-full focus:outline-none outline-none">
                      <img
                        src={imgSrc}
                        alt={`Quality Control Process ${index + 1}`}
                        className="h-full w-full object-cover" // Image itself is not rounded, parent container clips it
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityAssurance;