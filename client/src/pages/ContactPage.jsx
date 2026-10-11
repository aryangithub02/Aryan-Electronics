import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building2,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Product Specifications & Hardware Compatibility',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [activeFaq, setActiveFaq] = useState(0);

  const contactChannels = [
    {
      icon: Mail,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'Email Support',
      primary: 'support@aryanelectronics.com',
      secondary: 'Response SLA: Within 2-4 business hours',
      actionText: 'Send Email',
      actionHref: 'mailto:support@aryanelectronics.com'
    },
    {
      icon: Phone,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'Toll-Free Support Line',
      primary: '+91 (800) 279-2601',
      secondary: 'Mon – Sat: 9:00 AM – 8:00 PM IST',
      actionText: 'Call Now',
      actionHref: 'tel:+918002792601'
    },
    {
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'B2B & Institutional Desk',
      primary: 'b2b@aryanelectronics.com',
      secondary: 'Bulk quotes, educational POs & GST input invoices',
      actionText: 'Procurement Desk',
      actionHref: 'mailto:b2b@aryanelectronics.com'
    },
    {
      icon: MapPin,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      title: 'Technology Headquarters',
      primary: 'Aryan Tech Center, Sector 24, Cyber City',
      secondary: 'Gurugram & Bengaluru Tech Corridor, India',
      actionText: 'View on Maps',
      actionHref: 'https://maps.google.com'
    }
  ];

  const faqs = [
    {
      q: 'How does Aryan Electronics aggregate and compare electronics prices?',
      a: 'Our aggregation engine ingests product stock, shipping costs, and live prices from 11+ verified merchant platforms (including Amazon India, Croma, IndustryBuying, RS Components, and official brand stores). We match exact Manufacturer Part Numbers (MPNs) so you compare genuinely identical hardware side by side.'
    },
    {
      q: 'Are all products sold through Aryan Electronics genuine with valid warranties?',
      a: 'Yes, 100%. We enforce strict seller onboarding standards. Every merchant partner must be an authorized distributor or licensed retail enterprise in India, providing authentic serial numbers, valid GST tax invoices, and standard manufacturer-backed warranty coverage.'
    },
    {
      q: 'Can institutions and businesses purchase with GST input credit?',
      a: 'Absolutely. For institutional or bulk orders across Education, Industrial, or Healthcare sectors, all aggregated sellers issue official GST invoices. You can enter your GSTIN during checkout on the merchant platform to claim full input tax credit.'
    },
    {
      q: 'How can our company or dealership become a verified merchant partner?',
      a: 'We welcome authorized electronics distributors, robotics makers, and licensed dealers. Submit your company profile with active GST registration, brand distribution certificates, and fulfillment SLA details via our Merchant Partnership Desk at partners@aryanelectronics.com.'
    },
    {
      q: 'How does the hardware specification matrix compare products?',
      a: 'Our comparison matrix inspects deep hardware characteristics: processor architectures, TDP, memory buses, sensor accuracies, interface ports, and compliance certifications. Select any products from our catalog and click "Compare" to view side-by-side spec sheets.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable ticket creation
    setTimeout(() => {
      const ticketId = `AE-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTicket({
        id: ticketId,
        name: formData.name,
        email: formData.email,
        inquiryType: formData.inquiryType,
        subject: formData.subject
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Product Specifications & Hardware Compatibility',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-16">
      {/* 1. Page Header */}
      <div className="bg-[#090e1a] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400 font-medium">Contact Us</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-mono font-semibold">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Support & Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              We’re Here to Help You Find the Right Tech
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Have questions about hardware specifications, multi-seller prices, institutional procurement, or partnership opportunities? Reach out to our engineering and support specialists.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-12">
        {/* 2. Quick Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((channel) => (
            <div
              key={channel.title}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${channel.iconBg}`}>
                  <channel.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{channel.title}</h3>
                  <p className="font-medium text-xs text-slate-800 mt-1 break-all">{channel.primary}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{channel.secondary}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={channel.actionHref}
                  target={channel.actionHref.startsWith('http') ? '_blank' : undefined}
                  rel={channel.actionHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>{channel.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Main Form and Help Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill out the form below and an Aryan Electronics specialist will get back to you promptly.
              </p>
            </div>

            {submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-900 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-emerald-900">Message Received!</h3>
                    <p className="text-xs text-emerald-700">Ticket Reference: <strong className="font-mono">{submittedTicket.id}</strong></p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  Thank you, <strong>{submittedTicket.name}</strong>. We have logged your request under <em>"{submittedTicket.inquiryType}"</em> and sent a confirmation to <strong>{submittedTicket.email}</strong>. Our technical support team typically responds within 2-4 business hours.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="name">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Aryan Sharma"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="email">
                      Work / Personal Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="phone">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="inquiryType">
                      Inquiry Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    >
                      <option value="Product Specifications & Hardware Compatibility">Product Specs & Compatibility</option>
                      <option value="Multi-Merchant Price Matching & Availability">Price Matching & Availability</option>
                      <option value="Bulk / Institutional Procurement (B2B / GST)">Bulk / Institutional Procurement (B2B)</option>
                      <option value="Merchant Onboarding & Dealership">Merchant Onboarding & Dealership</option>
                      <option value="General Technical Inquiry">General Technical Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="subject">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your question or request"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="message">
                    Detailed Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Include details such as product models, volume, or specific technical queries..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Operating Info & Trust Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Operating Hours & SLAs</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium text-slate-800">Monday – Friday</span>
                  <span className="font-mono text-slate-600">9:00 AM – 8:00 PM IST</span>
                </li>
                <li className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-medium text-slate-800">Saturday</span>
                  <span className="font-mono text-slate-600">10:00 AM – 5:00 PM IST</span>
                </li>
                <li className="flex items-center justify-between py-1.5">
                  <span className="font-medium text-slate-800">Sunday</span>
                  <span className="text-amber-600 font-semibold">AI Assistant Active 24/7</span>
                </li>
              </ul>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                Emergency procurement and server inquiries receive priority ticket routing.
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-[#0c1424] text-white rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Genuine Merchant Guarantee</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All prices and deals indexed on Aryan Electronics originate from authenticated merchants. We guarantee valid GST invoices and full original manufacturer warranty coverage on all fulfilled orders.
              </p>
              <div className="pt-2">
                <Link
                  to="/brands"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  <span>View Verified Merchant Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Frequently Asked Questions Accordion */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Common Questions
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Quick answers about aggregation, merchant guarantees, warranties, and orders.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fade-in pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
