import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ContactAction {
  text: string;
  href: string;
}

interface ContactItem {
  icon: React.ReactNode;
  title: string;
  details: string[];
  actions?: ContactAction[];
  action?: ContactAction;
}

interface FormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_company: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_company: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animatePlane, setAnimatePlane] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) setSubmitted(false);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitted(false); 
    setIsLoading(true);
    setAnimatePlane(true); 

    if (!formData.user_name || !formData.user_email || !formData.message) {
      setError('Please fill in all required fields: Name, Email, and Message.');
      setIsLoading(false);
      setAnimatePlane(false); 
      return;
    }

    try {
      const { hostname, protocol } = window.location;
      const API_BASE_URL = import.meta.env.MODE === 'development' 
        ? `${protocol}//${hostname}:3000`
        : '';

      const response = await axios.post(
        `${API_BASE_URL}/api/send-email`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        setSubmitted(true);
        setFormData({ 
          user_name: '', user_company: '', user_email: '', user_phone: '', message: ''
        });
      } else {
        setError(response.data.message || 'Failed to send message.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      // The useEffect below will handle resetting animatePlane after the animation
    }
  };
  
  useEffect(() => {
    // This effect ensures animatePlane is reset after the animation has had time to complete,
    // but only if we are no longer in the loading state (i.e., submission finished or failed).
    if (animatePlane && !isLoading) {
      const timer = setTimeout(() => {
        setAnimatePlane(false);
      }, 1000); // Animation duration is 1s
      return () => clearTimeout(timer);
    }
  }, [animatePlane, isLoading]);


  const contactInfo: ContactItem[] = [
    {
      icon: <Phone className="h-6 w-6 text-[#2563EB]" />,
      title: 'WhatsApp/Call',
      details: ['+91 9895501632'],
      actions: [
        { text: 'Call Us', href: 'tel:+919895501632' },
        { text: 'WhatsApp Us', href: 'https://wa.me/919895501632' },
      ],
    },
    {
      icon: <Mail className="h-6 w-6 text-[#2563EB]" />,
      title: 'Email',
      details: ['info@rrbusiness.com'],
      action: { text: 'Email Us', href: 'mailto:info@rrbusiness.com' },
    },
    {
      icon: <MapPin className="h-6 w-6 text-[#2563EB]" />,
      title: 'Location',
      details: ['RR Business Group, Valakom, 691532, India'],
      action: { text: 'View on Map', href: 'https://maps.google.com/?q=RR+Business+Group,Valakom,691532,India' }, // Improved maps link
    },
  ];

  let buttonClass = "inline-flex items-center justify-center px-6 py-3 text-white font-heading rounded-md w-full transition-all duration-300 ease-in-out relative overflow-hidden"; // Added relative and overflow-hidden
  if (submitted) {
    buttonClass += " bg-green-500 hover:bg-green-600";
  } else if (isLoading) {
    buttonClass += " bg-[#2563EB] opacity-85 cursor-not-allowed"; // Slightly less opacity for loading
  } else {
    buttonClass += " bg-[#2563EB] hover:bg-[#1E40AF]";
  }

  return (
    <section className="py-16 bg-[#F8FAFC] font-sans" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#1E293B] mb-6">Get In Touch</h2>
            <p className="text-[#475569] mb-8">
              Have questions about our products or services? We're here to help.
            </p>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[#1E293B]">{info.title}</h3>
                    <div className="mt-1 text-[#475569]">
                      {info.details.map((detail, idx) => ( <p key={idx}>{detail}</p> ))}
                    </div>
                    {info.actions ? (
                      <div className="mt-2 space-x-3">
                        {info.actions.map((action, i) => (
                          <a key={i} href={action.href} className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1E40AF] transition-colors" target="_blank" rel="noopener noreferrer">
                            {action.text}
                          </a>
                        ))}
                      </div>
                    ) : ( info.action && (
                        <a href={info.action.href} className="mt-2 inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1E40AF] transition-colors" target="_blank" rel="noopener noreferrer">
                          {info.action.text}
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold font-heading text-[#1E293B] mb-6">Send Us a Message</h3>
            {submitted && !error && (
              <div className="mb-6 p-4 rounded-md bg-green-100 text-green-700 border border-green-200">
                Thank you! Your message has been sent successfully. We'll respond shortly.
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700 border border-red-200">
                {error}
              </div>
            )}
            <form ref={form} onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <input type="text" name="user_name" placeholder="Full Name*" required value={formData.user_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-colors duration-300" disabled={isLoading || submitted} />
                <input type="email" name="user_email" placeholder="Email Address*" required value={formData.user_email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-colors duration-300" disabled={isLoading || submitted} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <input type="tel" name="user_phone" placeholder="Phone (Optional)" value={formData.user_phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-colors duration-300" disabled={isLoading || submitted} />
                <input type="text" name="user_company" placeholder="Company (Optional)" value={formData.user_company} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-colors duration-300" disabled={isLoading || submitted} />
              </div>
              <div className="mb-6">
                <textarea name="message" rows={4} placeholder="Message*" required value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-colors duration-300" disabled={isLoading || submitted}></textarea>
              </div>
              <button
                type="submit"
                disabled={isLoading || submitted}
                className={buttonClass}
              >
                {submitted && !error ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Message Sent!
                  </>
                ) : isLoading ? (
                  <>
                    <span className="mr-2">Sending...</span>
                    {/* Wrapper span for the Send icon animation */}
                    <span className={animatePlane ? 'animate-fly-off-wrapper' : 'inline-block'}>
                      <Send size={18} />
                    </span>
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;