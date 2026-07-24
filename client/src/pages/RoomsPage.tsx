import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { api } from '../services/api';

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image?: string;
  amenities: string[];
  rating: number;
  reviews: number;
}

const fallbackImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [roomType, setRoomType] = useState('');
  const [amenity, setAmenity] = useState('');

  const loadRooms = async () => {
    setLoading(true);
    setError('');

    const params: Record<string, string> = {};
    if (roomType) params.type = roomType;
    if (amenity) params.amenity = amenity;
    if (priceRange === '100-300') {
      params.min_price = '100';
      params.max_price = '300';
    } else if (priceRange === '300-500') {
      params.min_price = '300';
      params.max_price = '500';
    } else if (priceRange === '500+') {
      params.min_price = '500';
    }

    try {
      const response = await api.getRooms(params);
      if (!response.ok) {
        throw new Error('Failed to load rooms');
      }
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (roomsError) {
      setError('Unable to load rooms from the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

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
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Prices</option>
                <option value="100-300">$100 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="500+">$500+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="executive">Executive</option>
                <option value="presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <select
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Amenities</option>
                <option value="Ocean View">Ocean View</option>
                <option value="Balcony">Balcony</option>
                <option value="Jacuzzi">Jacuzzi</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={loadRooms} className="w-full btn-primary">Apply Filters</button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center text-gray-700">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <div key={room.id} className="card-gradient overflow-hidden hover-lift animate-slide-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={room.image || fallbackImage} 
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
        )}

        {/* Load More */}
        <div className="text-center mt-16 animate-fade-in">
          <button className="btn-secondary">Load More Rooms</button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
