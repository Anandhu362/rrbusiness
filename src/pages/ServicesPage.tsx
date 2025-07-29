import React from 'react';
import { Globe, Truck, ShoppingCart, Tag, Package, Send } from 'lucide-react'; // You can use Lucide icons

const services = [
  {
    title: 'Global Sourcing',
    icon: <Globe size={40} />,
    description:
      'Leveraging our global network of trusted suppliers and partners, we specialize in sourcing the finest quality food products from around the world.',
  },
  {
    title: 'Import and Export',
    icon: <Send size={40} />,
    description:
      'We are dedicated to sourcing premium food products globally and exporting them to local markets, ensuring our clients receive the best from around the world.',
  },
  {
    title: 'Packaging',
    icon: <Package size={40} />,
    description:
      'Our packaging services are designed to maintain the freshness, safety, and quality of the food products while ensuring they are visually appealing and aligned with our clients’ branding.',
  },
  {
    title: 'Labelling',
    icon: <Tag size={40} />,
    description:
      'Our labeling services provide custom designs that align with your brand, ensuring compliance with industry standards and clear display of essential information for consumer safety and trust.',
  },
  {
    title: 'Efficient Logistics',
    icon: <Truck size={40} />,
    description:
      'We optimize supply chain processes and partner with trusted logistics providers to ensure timely and efficient delivery of products.',
  },
  {
    title: 'Wholesale and Retail Distribution',
    icon: <ShoppingCart size={40} />,
    description:
      'We provide comprehensive wholesale and retail distribution services to ensure our products reach consumers at the point of sale.',
  },
];

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white/70 backdrop-blur"
          >
            <div className="flex items-center justify-center mb-4 text-[#c0392b]">
              {service.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">
              {service.title}
            </h2>
            <p className="text-gray-700 text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
