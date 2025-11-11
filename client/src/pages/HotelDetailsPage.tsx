import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Waves, 
  Utensils,
  Shield,
  Clock,
  Users,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: string;
  price: { base: number; weekend: number };
  size: string;
  beds: string;
  maxGuests: number;
  images: string[];
  amenities: string[];
  description: string;
  available: boolean;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  amenities: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  rooms: Room[];
}

const HotelDetailsPage: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Mock hotel data - in real app, this would come from API
  const hotel: Hotel = {
    id: 'luxury-grand-hotel',
    name: 'Luxury Grand Hotel',
    location: 'Accra, Ghana',
    address: '123 Independence Avenue, Accra Central, Ghana',
    rating: 4.8,
    reviews: 2847,
    images: [
      '/hotel-exterior.jpg',
      '/hotel-lobby.jpg',
      '/hotel-pool.jpg',
      '/hotel-restaurant.jpg',
      '/hotel-spa.jpg'
    ],
    description: 'Experience unparalleled luxury at the Luxury Grand Hotel, where contemporary elegance meets traditional Ghanaian hospitality. Located in the heart of Accra, our 5-star hotel offers breathtaking views of the Atlantic Ocean and easy access to the city\'s business and cultural districts.',
    amenities: [
      'Free Wi-Fi',
      'Swimming Pool',
      'Fitness Center',
      'Spa & Wellness',
      'Restaurant & Bar',
      'Room Service',
      'Concierge',
      'Valet Parking',
      'Business Center',
      'Airport Shuttle',
      'Laundry Service',
      'Pet Friendly'
    ],
    contact: {
      phone: '+233 30 123 4567',
      email: 'reservations@luxurygrand.com',
      website: 'www.luxurygrandhotel.com'
    },
    rooms: [
      {
        id: 'standard',
        name: 'Standard Room',
        type: 'Standard',
        price: { base: 149, weekend: 189 },
        size: '32 m²',
        beds: '1 King or 2 Twin beds',
        maxGuests: 2,
        images: ['/room-standard-1.jpg', '/room-standard-2.jpg'],
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Coffee Maker'],
        description: 'Comfortable and elegantly appointed standard rooms with modern amenities and city views.',
        available: true
      },
      {
        id: 'deluxe',
        name: 'Deluxe Ocean View',
        type: 'Deluxe',
        price: { base: 229, weekend: 279 },
        size: '45 m²',
        beds: '1 King bed',
        maxGuests: 3,
        images: ['/room-deluxe-1.jpg', '/room-deluxe-2.jpg', '/room-deluxe-3.jpg'],
        amenities: ['Ocean View', 'Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Coffee Maker', 'Balcony'],
        description: 'Spacious deluxe rooms featuring stunning ocean views and a private balcony.',
        available: true
      },
      {
        id: 'executive',
        name: 'Executive Suite',
        type: 'Suite',
        price: { base: 389, weekend: 459 },
        size: '65 m²',
        beds: '1 King bed + Sofa bed',
        maxGuests: 4,
        images: ['/room-executive-1.jpg', '/room-executive-2.jpg', '/room-executive-3.jpg'],
        amenities: ['Ocean View', 'Separate Living Area', 'Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Coffee Maker', 'Balcony', 'Executive Lounge Access'],
        description: 'Luxurious executive suites with separate living areas and exclusive lounge access.',
        available: true
      },
      {
        id: 'presidential',
        name: 'Presidential Suite',
        type: 'Presidential',
        price: { base: 749, weekend: 899 },
        size: '120 m²',
        beds: '1 King bed + 2 Sofa beds',
        maxGuests: 6,
        images: ['/room-presidential-1.jpg', '/room-presidential-2.jpg', '/room-presidential-3.jpg'],
        amenities: ['Panoramic Ocean View', 'Separate Living & Dining Areas', 'Kitchen', 'Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Safe', 'Multiple TVs', 'Coffee Maker', 'Large Balcony', 'Butler Service', 'Executive Lounge Access'],
        description: 'The ultimate in luxury accommodation with panoramic ocean views and personalized butler service.',
        available: false
      }
    ]
  };

  const today = new Date().toISOString().split('T')[0];

  const handleBookRoom = (room: Room) => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    // Store booking data and navigate to booking page
    const bookingData = {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        address: hotel.address
      },
      room: {
        id: room.id,
        name: room.name,
        type: room.type,
        price: room.price
      },
      checkIn,
      checkOut,
      guests
    };
    
    localStorage.setItem('selectedBooking', JSON.stringify(bookingData));
    navigate('/booking');
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src={hotel.images[selectedImageIndex]} 
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Image Navigation */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{hotel.rating}</span>
                <span>({hotel.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Description */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {hotel.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{hotel.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hotel Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotel.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{hotel.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{hotel.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{hotel.contact.website}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
              
              <div className="space-y-6">
                {hotel.rooms.map((room) => (
                  <div key={room.id} className={`border rounded-xl p-6 ${!room.available ? 'bg-gray-50 opacity-75' : 'hover:shadow-md transition-shadow'}`}>
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Room Image */}
                      <div className="md:col-span-1">
                        <img 
                          src={room.images[0]} 
                          alt={room.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Room Details */}
                      <div className="md:col-span-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Maximize className="w-4 h-4" />
                            <span>{room.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            <span>{room.beds}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Up to {room.maxGuests} guests</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Room Amenities</h4>
                          <div className="grid grid-cols-2 gap-1">
                            {room.amenities.slice(0, 6).map((amenity, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                          {room.amenities.length > 6 && (
                            <p className="text-xs text-blue-600 mt-1">+{room.amenities.length - 6} more amenities</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Pricing & Booking */}
                      <div className="md:col-span-1 flex flex-col justify-between">
                        <div>
                          <div className="text-right mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                              ${room.price.base}
                              <span className="text-sm font-normal text-gray-600">/night</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Weekend: ${room.price.weekend}/night
                            </div>
                          </div>
                          
                          {!room.available && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                              <p className="text-red-700 text-sm font-medium">Currently unavailable</p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleBookRoom(room)}
                          disabled={!room.available}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                            room.available
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {room.available ? 'Select Room' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Check Availability</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Starting from</span>
                  <span className="text-2xl font-bold text-gray-900">${Math.min(...hotel.rooms.filter(r => r.available).map(r => r.price.base))}</span>
                </div>
                <p className="text-xs text-gray-500">per night, before taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
