import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Car, Coffee, Dumbbell, Star, ChevronRight, MapPin, Phone, Mail, Clock, Check } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white overflow-hidden min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(51, 65, 85, 0.75) 100%), url('/homepage.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0">
          <div
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-gold-500/20 backdrop-blur-sm rounded-full mb-6 border border-gold-400/30 shadow-2xl">
              <Star className="h-4 w-4 text-gold-400 mr-2" />
              <span className="text-gold-200 text-sm font-medium">Award-Winning Luxury Hotel</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight" style={{
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 8px 40px rgba(0, 0, 0, 0.3)'
            }}>
              Welcome to
              <span className="block bg-gradient-to-r from-gold-400 via-accent-300 to-gold-400 bg-clip-text text-transparent animate-shimmer" style={{
                textShadow: '0 4px 20px rgba(250, 204, 21, 0.3), 0 8px 40px rgba(217, 119, 6, 0.2)'
              }}>
                LuxuryStay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              Experience unparalleled elegance and sophistication in the heart of the city. 
              Where every moment is crafted to perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link
                to="/booking"
                className="group relative px-10 py-5 bg-gradient-to-r from-gold-500 via-accent-600 to-gold-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-gold-500/60 hover:shadow-3xl overflow-hidden"
                style={{
                  boxShadow: '0 0 40px rgba(250, 204, 21, 0.6), 0 0 80px rgba(217, 119, 6, 0.4), 0 12px 40px rgba(0, 0, 0, 0.4)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  🏨 Book Your Stay
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </Link>
              <button
                className="group relative px-10 py-5 bg-gradient-to-r from-burgundy-500 via-luxury-600 to-burgundy-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-burgundy-500/60 hover:shadow-3xl overflow-hidden"
                style={{
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.6), 0 0 80px rgba(217, 39, 119, 0.4), 0 12px 40px rgba(0, 0, 0, 0.4)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  📞 Contact Us
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-400 to-luxury-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
                <Star className="h-5 w-5 text-gold-400" />
                <span className="text-sm font-medium">5-Star Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold-400" />
                <span className="text-sm font-medium">24/7 Concierge</span>
              </div>
            </div>
          </div>
        </div>
        
      </section>


      {/* Features Section */}
      <section className="py-24 relative overflow-hidden transition-all duration-700" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-ocean-200/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-3 py-1 bg-secondary-100 rounded-full mb-4">
              <span className="text-secondary-700 text-sm font-semibold">Premium Amenities</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8" style={{background: 'linear-gradient(135deg, #334155, #1e293b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Exceptional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Indulge in our world-class amenities designed for the most discerning guests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card text-center group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)'}}>
                <Wifi className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-ocean-600 transition-colors duration-300">Free WiFi</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">High-speed internet access throughout the property with secure connectivity for all your devices</p>
              <div className="mt-4 flex items-center justify-center text-ocean-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Available 24/7</span>
              </div>
            </div>
            <div className="feature-card text-center group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'}}>
                <Coffee className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">Complimentary Breakfast</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">Gourmet breakfast buffet featuring local and international cuisine prepared by our expert chefs</p>
              <div className="mt-4 flex items-center justify-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">7:00 AM - 11:00 AM</span>
              </div>
            </div>
            <div className="feature-card text-center group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)'}}>
                <Car className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Airport Transfer</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">Complimentary airport shuttle service with luxury vehicles and professional chauffeurs</p>
              <div className="mt-4 flex items-center justify-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Available 24/7</span>
              </div>
            </div>
            <div className="feature-card text-center group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{background: 'linear-gradient(135deg, #ec4899, #db2777)', boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)'}}>
                <Dumbbell className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">Fitness Center</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">State-of-the-art fitness facility with premium equipment and personal training services</p>
              <div className="mt-4 flex items-center justify-center text-luxury-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Personal Training</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-200/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-luxury-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-3 py-1 bg-secondary-100 rounded-full mb-4">
              <span className="text-secondary-700 text-sm font-semibold">Guest Experiences</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8" style={{background: 'linear-gradient(135deg, #334155, #1e293b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>What Our Guests Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover why discerning travelers from around the world choose LuxuryStay for their unforgettable experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                "Absolutely amazing experience! The staff was incredibly helpful and the room was spotless. Pure luxury!"
              </p>
              <div className="text-center">
                <div className="font-bold text-ocean-600 text-xl mb-1">Sarah Johnson</div>
                <div className="text-sm text-gray-500 font-medium">Business Traveler</div>
              </div>
            </div>
            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100" style={{animationDelay: '0.2s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                "Perfect location and excellent amenities. Will definitely stay here again! Outstanding service."
              </p>
              <div className="text-center">
                <div className="font-bold text-burgundy-600 text-xl mb-1">Michael Chen</div>
                <div className="text-sm text-gray-500 font-medium">Vacation Guest</div>
              </div>
            </div>
            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100" style={{animationDelay: '0.3s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                "Luxury at its finest. Every detail was perfect from check-in to check-out. Unforgettable experience!"
              </p>
              <div className="text-center">
                <div className="font-bold text-luxury-600 text-xl mb-1">Emily Davis</div>
                <div className="text-sm text-gray-500 font-medium">Weekend Getaway</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="text-white py-28 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-burgundy-500/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-luxury-500/10 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <span className="text-white text-sm font-medium">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to Book Your Stay?</h2>
            <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto text-white/90 leading-relaxed">
              Join thousands of satisfied guests and experience luxury hospitality at its finest. 
              Book now and receive exclusive complimentary amenities.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
              <Link
                to="/booking"
                className="group relative px-12 py-6 bg-gradient-to-r from-gold-500 via-accent-600 to-gold-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-gold-500/60 hover:shadow-3xl overflow-hidden"
                style={{
                  boxShadow: '0 0 50px rgba(250, 204, 21, 0.7), 0 0 100px rgba(217, 119, 6, 0.4), 0 12px 40px rgba(0, 0, 0, 0.4)',
                  animation: 'glow 3s ease-in-out infinite alternate'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-3 text-xl font-semibold">
                  <span className="text-2xl">🏨</span> Book Your Stay <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </Link>
              <button
                className="group relative px-12 py-6 bg-gradient-to-r from-burgundy-500 via-luxury-600 to-burgundy-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-burgundy-500/60 hover:shadow-3xl overflow-hidden"
                style={{
                  boxShadow: '0 0 50px rgba(236, 72, 153, 0.7), 0 0 100px rgba(217, 39, 119, 0.4), 0 12px 40px rgba(0, 0, 0, 0.4)',
                  animation: 'glow 3s ease-in-out infinite alternate',
                  animationDelay: '0.7s'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-3 text-xl font-semibold">
                  <span className="text-2xl">📞</span> Contact Us <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-400 to-luxury-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12 text-gray-300 animate-slide-up" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-gold-400" />
                <span className="text-base font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-gold-400" />
                <span className="text-base font-medium">reservations@luxurystay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-gold-400" />
                <span className="text-base font-medium">24/7 Service Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
