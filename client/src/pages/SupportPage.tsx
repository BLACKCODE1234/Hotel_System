import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  ArrowLeft,
  HelpCircle,
  FileText,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass';

const SupportPage: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How can I cancel my booking?",
      answer: "You can cancel your booking up to 24 hours before check-in through your dashboard under 'My Bookings'. For cancellations within 24 hours, please contact our support team directly.",
      category: "booking"
    },
    {
      id: 2,
      question: "What is your refund policy?",
      answer: "Full refunds are available for cancellations made 48+ hours before check-in. Cancellations within 24-48 hours receive a 50% refund. Same-day cancellations are non-refundable unless due to extraordinary circumstances.",
      category: "payment"
    },
    {
      id: 3,
      question: "How do I earn loyalty points?",
      answer: "You earn 10 points per dollar spent on bookings. Bonus points are awarded for reviews (50 points), referrals (100 points), and special promotions. Points can be redeemed for discounts and free nights.",
      category: "rewards"
    },
    {
      id: 4,
      question: "Can I modify my reservation?",
      answer: "Yes, you can modify your reservation dates and room type through your dashboard, subject to availability. Changes made within 24 hours of check-in may incur additional fees.",
      category: "booking"
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment is processed securely through our encrypted payment gateway.",
      category: "payment"
    },
    {
      id: 6,
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within 5 minutes. If you don't see it, check your spam folder.",
      category: "account"
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support form submitted:', contactForm);
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="btn-ghost inline-flex items-center gap-2 mb-8 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <header className="mb-10">
          <p className="section-label mb-2">Guest services</p>
          <h1 className="page-title mb-3">Support</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Find answers to common questions or reach our front desk team directly.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: MessageCircle,
              title: 'Live chat',
              detail: 'Available 24/7',
              desc: 'Instant help from our guest services team.',
              action: 'Start chat',
              onClick: () => {},
            },
            {
              icon: Phone,
              title: 'Phone',
              detail: 'Mon–Fri 8 AM–8 PM',
              desc: 'Speak with a reservations specialist.',
              action: 'Call now',
              href: 'tel:+1-800-HOTEL-01',
            },
            {
              icon: Mail,
              title: 'Email',
              detail: 'Response within 2 hours',
              desc: 'Send a detailed message about your stay.',
              action: 'Send email',
              href: 'mailto:support@hotel.com',
            },
          ].map(({ icon: Icon, title, detail, desc, action, href, onClick }) => (
            <div key={title} className="panel">
              <Icon className="w-5 h-5 text-brass mb-3" />
              <h3 className="font-display text-xl text-ink mb-1">{title}</h3>
              <p className="text-xs text-brass font-semibold tracking-wide uppercase mb-2">{detail}</p>
              <p className="text-sm text-ink-muted mb-5">{desc}</p>
              {href ? (
                <a href={href} className="btn-secondary w-full text-sm py-2">{action}</a>
              ) : (
                <button type="button" onClick={onClick} className="btn-secondary w-full text-sm py-2">{action}</button>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="panel">
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brass" />
              Frequently asked questions
            </h2>

            <div className="mb-6 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={inputClass}
              >
                <option value="all">All categories</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="rewards">Rewards</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredFAQs.length === 0 ? (
                <p className="text-ink-muted text-sm py-8 text-center">
                  No questions match your search.
                </p>
              ) : (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-sand-deep">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-4 py-3 text-left bg-sand-warm hover:bg-sand flex items-center justify-between gap-4 transition-colors"
                    >
                      <span className="font-medium text-ink text-sm">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-ink-muted flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-ink-muted flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 py-3 border-t border-sand-deep bg-white">
                        <p className="text-sm text-ink-muted leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel">
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-brass" />
              Contact us
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className={inputClass}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your question or issue"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                <Send className="w-4 h-4" />
                Send message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="panel">
            <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brass" />
              Support hours
            </h3>
            <dl className="space-y-2 text-sm">
              {[
                ['Monday – Friday', '8:00 AM – 8:00 PM'],
                ['Saturday', '9:00 AM – 6:00 PM'],
                ['Sunday', '10:00 AM – 4:00 PM'],
                ['Emergency line', '24/7'],
              ].map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4">
                  <dt className="text-ink-muted">{day}</dt>
                  <dd className="font-medium text-ink">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel">
            <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brass" />
              Front desk
            </h3>
            <address className="text-sm text-ink-muted not-italic space-y-1">
              <p>123 Hotel Plaza</p>
              <p>Accra, Greater Accra</p>
              <p>Ghana</p>
            </address>
            <p className="text-sm text-ink mt-4">
              <span className="text-ink-muted">Phone:</span>{' '}
              <a href="tel:+1-800-HOTEL-01" className="text-brass hover:text-brass-deep">+1 (800) HOTEL-01</a>
            </p>
            <p className="text-sm text-ink">
              <span className="text-ink-muted">Email:</span>{' '}
              <a href="mailto:support@hotel.com" className="text-brass hover:text-brass-deep">support@hotel.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
