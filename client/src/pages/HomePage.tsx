import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white overflow-hidden min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(51, 65, 85, 0.65) 100%), url('/homepage.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-10 w-64 h-64 rounded-full animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(217, 119, 6, 0.1))',
              filter: 'blur(40px)'
            }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(219, 39, 119, 0.08))',
              filter: 'blur(50px)',
              animationDelay: '1s'
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(2, 132, 199, 0.06))',
              filter: 'blur(45px)',
              animationDelay: '2s'
            }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 hero-text">
              Experience Luxury Like Never Before
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/90 animate-fade-in" style={{animationDelay: '0.3s'}}>
              Discover our premium hotel rooms with world-class amenities and exceptional service in the most breathtaking locations
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{animationDelay: '0.6s'}}>
              <Link
                to="/rooms"
                className="group relative px-8 py-4 bg-gradient-to-r from-accent-500 via-accent-600 to-gold-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-accent-500/50 hover:shadow-2xl animate-pulse-slow overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(217, 119, 6, 0.3)',
                  animation: 'glow 2s ease-in-out infinite alternate'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  ✨ View Our Rooms
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </Link>
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-burgundy-500 via-luxury-600 to-burgundy-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-burgundy-500/50 hover:shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(217, 39, 119, 0.3)',
                  animation: 'glow 2s ease-in-out infinite alternate',
                  animationDelay: '0.5s'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Sign In to Book
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-400 to-luxury-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>
        
      </section>


      {/* Features Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-6" style={{background: 'linear-gradient(135deg, #1e293b, #0f172a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Why Choose LuxuryStay?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience unparalleled comfort and service with our premium amenities designed for the modern traveler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div 
                className="feature-icon"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
                }}
              >
                <Wifi className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-ocean-600 transition-colors duration-300">Free WiFi</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Lightning-fast internet access throughout the entire hotel premises</p>
            </div>
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div 
                className="feature-icon"
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
              >
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">Free Parking</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Complimentary valet parking service for all our valued guests</p>
            </div>
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div 
                className="feature-icon"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                }}
              >
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors duration-300">24/7 Room Service</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Round-the-clock gourmet dining and premium service at your fingertips</p>
            </div>
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div 
                className="feature-icon"
                style={{
                  background: 'linear-gradient(135deg, #d946ef, #c026d3)',
                  boxShadow: '0 4px 12px rgba(217, 70, 239, 0.25)'
                }}
              >
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-luxury-600 transition-colors duration-300">Fitness Center</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">State-of-the-art gym and wellness facilities with personal trainers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-200/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-luxury-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6" style={{background: 'linear-gradient(135deg, #334155, #1e293b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>What Our Guests Say</h2>
            <p className="text-xl text-gray-700">Discover why travelers from around the world choose LuxuryStay</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card text-center group" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic">
                "Absolutely amazing experience! The staff was incredibly helpful and the room was spotless. Pure luxury!"
              </p>
              <div className="font-bold text-ocean-600 text-lg">Sarah Johnson</div>
              <div className="text-sm text-gray-500 font-medium">Business Traveler</div>
            </div>
            <div className="testimonial-card text-center group" style={{animationDelay: '0.2s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic">
                "Perfect location and excellent amenities. Will definitely stay here again! Outstanding service."
              </p>
              <div className="font-bold text-burgundy-600 text-lg">Michael Chen</div>
              <div className="text-sm text-gray-500 font-medium">Vacation Guest</div>
            </div>
            <div className="testimonial-card text-center group" style={{animationDelay: '0.3s'}}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-500 fill-current animate-pulse-slow" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg italic">
                "Luxury at its finest. Every detail was perfect from check-in to check-out. Unforgettable experience!"
              </p>
              <div className="font-bold text-luxury-600 text-lg">Emily Davis</div>
              <div className="text-sm text-gray-500 font-medium">Weekend Getaway</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="text-white py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to Book Your Stay?</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90">
              Join thousands of satisfied guests and experience luxury hospitality
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/booking"
                className="group relative px-10 py-5 bg-gradient-to-r from-gold-500 via-accent-600 to-gold-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-gold-500/50 hover:shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 0 40px rgba(250, 204, 21, 0.6), 0 0 80px rgba(217, 119, 6, 0.4)',
                  animation: 'glow 2.5s ease-in-out infinite alternate'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  🏨 Book Your Stay
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </Link>
              <button
                className="group relative px-10 py-5 bg-gradient-to-r from-burgundy-500 via-luxury-600 to-burgundy-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-burgundy-500/50 hover:shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.6), 0 0 80px rgba(217, 39, 119, 0.4)',
                  animation: 'glow 2.5s ease-in-out infinite alternate',
                  animationDelay: '0.7s'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  📞 Contact Us
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-400 to-luxury-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
