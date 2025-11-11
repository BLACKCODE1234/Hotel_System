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
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
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
    // Handle form submission
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
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/userdashboard.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-emerald-900/20"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-emerald-600/10 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Support Center
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Chat</h3>
                <p className="text-green-300 text-sm">Available 24/7</p>
              </div>
            </div>
            <p className="text-white/80 mb-4">Get instant help from our support team</p>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg">
              Start Chat
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Phone Support</h3>
                <p className="text-blue-300 text-sm">Mon-Fri 8AM-8PM</p>
              </div>
            </div>
            <p className="text-white/80 mb-4">Speak directly with our experts</p>
            <a 
              href="tel:+1-800-HOTEL-01" 
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg text-center"
            >
              Call Now
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Email Support</h3>
                <p className="text-purple-300 text-sm">Response within 2 hours</p>
              </div>
            </div>
            <p className="text-white/80 mb-4">Send us a detailed message</p>
            <a 
              href="mailto:support@hotel.com" 
              className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg text-center"
            >
              Send Email
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div className="animate-slide-in-left">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-400" />
                Frequently Asked Questions
              </h2>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="booking">Booking</option>
                  <option value="payment">Payment</option>
                  <option value="rewards">Rewards</option>
                  <option value="account">Account</option>
                </select>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-white/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                        <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Send className="w-8 h-8 text-purple-400" />
                Contact Us
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>



                <div>
                  <label className="block text-white/80 mb-2 font-medium">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Support Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400" />
              Support Hours
            </h3>
            <div className="space-y-3 text-white/80">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="text-green-300">8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-green-300">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-green-300">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Support:</span>
                <span className="text-red-300">24/7 Available</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-red-400" />
              Visit Our Office
            </h3>
            <div className="text-white/80 space-y-2">
              <p>123 Hotel Plaza</p>
              <p>Accra, Greater Accra</p>
              <p>Ghana</p>
              <p className="mt-4 text-blue-300">
                <strong>Phone:</strong> +1 (800) HOTEL-01
              </p>
              <p className="text-purple-300">
                <strong>Email:</strong> support@hotel.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
