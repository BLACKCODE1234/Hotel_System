import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Wifi, Car, Coffee, Users, Bed } from 'lucide-react';

const RoomsPage: React.FC = () => {
  const rooms = [
    {
      id: 1,
      name: 'Deluxe King Room',
      price: 299,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar'],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Executive Suite',
      price: 499,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Separate Living Area', 'Ocean View', 'Balcony', 'Premium WiFi'],
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Standard Double Room',
      price: 199,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Two Double Beds', 'Garden View', 'Free WiFi', 'Coffee Maker'],
      rating: 4.6,
      reviews: 203
    },
    {
      id: 4,
      name: 'Presidential Suite',
      price: 899,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Master Bedroom', 'Private Terrace', 'Butler Service', 'Jacuzzi'],
      rating: 5.0,
      reviews: 45
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text mb-6">Our Rooms & Suites</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Choose from our selection of luxurious accommodations designed for the ultimate comfort and elegance
          </p>
        </div>

        {/* Filters */}
        <div className="card-gradient mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Prices</option>
                <option>$100 - $300</option>
                <option>$300 - $500</option>
                <option>$500+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Types</option>
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Amenities</option>
                <option>Ocean View</option>
                <option>Balcony</option>
                <option>Jacuzzi</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-primary">Apply Filters</button>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <div key={room.id} className="card-gradient overflow-hidden hover-lift animate-slide-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(room.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {room.rating} ({room.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">${room.price}</div>
                    <div className="text-sm text-gray-500 font-medium">per night</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 hover:from-primary-200 hover:to-secondary-200 transition-all duration-300 transform hover:scale-105"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 btn-secondary">View Details</button>
                  <Link 
                    to="/booking" 
                    className="flex-1 btn-primary text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16 animate-fade-in">
          <button className="btn-secondary">Load More Rooms</button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
