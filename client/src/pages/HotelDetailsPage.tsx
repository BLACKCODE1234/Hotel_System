import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Star,
  MapPin,
  CheckCircle,
  Users,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Globe,
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

const fallbackImages = [
  '/homepage.jpg',
  '/signup.jpg',
  '/userdashboard.jpg',
  '/userloginpage.jpg',
  '/homepage.jpg',
];

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass';

const HotelDetailsPage: React.FC = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHotel = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getHotelById(Number(hotelId) || 1);
        if (!response.ok) {
          throw new Error('Failed to load hotel');
        }
        const data = await response.json();
        setHotel({
          id: String(data.id),
          name: data.name,
          location: data.location || '',
          address: data.address || '',
          rating: Number(data.rating || 0),
          reviews: Number(data.reviews || 0),
          images: data.images?.length ? data.images : fallbackImages,
          description: data.description || '',
          amenities: data.amenities || [],
          contact: {
            phone: data.contact?.phone || '',
            email: data.contact?.email || '',
            website: data.contact?.website || '',
          },
          rooms: Array.isArray(data.rooms)
            ? data.rooms.map((room: any) => ({
                id: String(room.id),
                name: room.name,
                type: room.type,
                price: {
                  base: Number(room.price?.base || 0),
                  weekend: Number(room.price?.weekend || 0),
                },
                size: room.size || '',
                beds: room.beds || '',
                maxGuests: Number(room.maxGuests || 2),
                images: room.images?.length ? room.images : fallbackImages.slice(0, 2),
                amenities: room.amenities || [],
                description: room.description || '',
                available: Boolean(room.available),
              }))
            : [],
        });
      } catch {
        setError('Unable to load hotel details from the server.');
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [hotelId]);

  const today = new Date().toISOString().split('T')[0];

  const handleBookRoom = (room: Room) => {
    if (!hotel) return;
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const bookingData = {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        address: hotel.address,
      },
      room: {
        id: room.id,
        name: room.name,
        type: room.type,
        price: room.price,
      },
      checkIn,
      checkOut,
      guests,
    };

    localStorage.setItem('selectedBooking', JSON.stringify(bookingData));
    navigate('/booking');
  };

  const nextImage = () => {
    if (!hotel) return;
    setSelectedImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    if (!hotel) return;
    setSelectedImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-sand-deep border-t-brass" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel status-chip--danger border-[#E8C9C3] text-[#8B3A32]">
          {error || 'Hotel not found'}
        </div>
      </div>
    );
  }

  const minAvailablePrice = Math.min(...hotel.rooms.filter((r) => r.available).map((r) => r.price.base));

  return (
    <div className="min-h-screen">
      {/* Photo-led hero */}
      <div className="relative h-80 md:h-[28rem] bg-ink">
        <img
          src={hotel.images[selectedImageIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,33,43,0.2) 0%, rgba(20,33,43,0.75) 100%)',
          }}
        />

        <button
          type="button"
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 border border-white/40 bg-ink/40 p-2 text-white hover:bg-ink/60 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 border border-white/40 bg-ink/40 p-2 text-white hover:bg-ink/60 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <p className="section-label text-brass-soft mb-2">LuxuryStay</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-3">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/85 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brass-soft" />
                {hotel.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-brass-soft fill-brass-soft" />
                {hotel.rating}
                <span className="text-white/60">({hotel.reviews.toLocaleString()} reviews)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`h-1.5 w-6 transition-colors ${
                index === selectedImageIndex ? 'bg-brass' : 'bg-white/40'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="panel">
              <p className="section-label mb-2">About the property</p>
              <h2 className="font-display text-3xl text-ink mb-4">About {hotel.name}</h2>
              <p className="text-ink-muted leading-relaxed mb-8">{hotel.description}</p>

              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-wider text-ink-muted mb-4">Hotel amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-ink-muted text-sm">
                      <CheckCircle className="w-4 h-4 text-forest shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-sand-deep pt-6">
                <h3 className="text-xs uppercase tracking-wider text-ink-muted mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-ink-muted">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brass shrink-0" />
                    {hotel.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brass shrink-0" />
                    {hotel.contact.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brass shrink-0" />
                    {hotel.contact.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brass shrink-0" />
                    {hotel.contact.website}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="section-label mb-2">Rooms</p>
              <h2 className="font-display text-3xl text-ink mb-6">Available rooms</h2>

              <div className="space-y-6">
                {hotel.rooms.map((room) => (
                  <article
                    key={room.id}
                    className={`panel grid md:grid-cols-3 gap-6 ${
                      !room.available ? 'opacity-70 bg-sand' : ''
                    }`}
                  >
                    <div className="md:col-span-1">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-48 object-cover border border-sand-deep"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <h3 className="font-display text-2xl text-ink mb-2">{room.name}</h3>
                      <p className="text-ink-muted text-sm mb-4 leading-relaxed">{room.description}</p>

                      <div className="space-y-2 text-sm text-ink-muted">
                        <p className="flex items-center gap-2">
                          <Maximize className="w-4 h-4 text-brass" />
                          {room.size}
                        </p>
                        <p className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-brass" />
                          {room.beds}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-brass" />
                          Up to {room.maxGuests} guests
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-xs uppercase tracking-wider text-ink-muted mb-2">Room amenities</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {room.amenities.slice(0, 6).map((amenity, index) => (
                            <p key={index} className="flex items-center gap-1 text-xs text-ink-muted">
                              <CheckCircle className="w-3 h-3 text-forest shrink-0" />
                              {amenity}
                            </p>
                          ))}
                        </div>
                        {room.amenities.length > 6 && (
                          <p className="text-xs text-brass mt-1">+{room.amenities.length - 6} more</p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-sand-deep pt-4 md:pt-0 md:pl-6">
                      <div>
                        <p className="font-display text-3xl text-ink">
                          ${room.price.base}
                          <span className="text-sm font-sans text-ink-muted">/night</span>
                        </p>
                        <p className="text-sm text-ink-muted mt-1">Weekend: ${room.price.weekend}/night</p>

                        {!room.available && (
                          <span className="status-chip status-chip--danger mt-4 inline-block">
                            Unavailable
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBookRoom(room)}
                        disabled={!room.available}
                        className={`mt-4 w-full ${
                          room.available ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {room.available ? 'Select room' : 'Unavailable'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="panel sticky top-8">
              <p className="section-label mb-2">Reserve</p>
              <h3 className="font-display text-2xl text-ink mb-6">Check availability</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
                    Check-in date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
                    Check-out date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputClass}>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-sand-deep">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-ink-muted">Starting from</span>
                  <span className="font-display text-3xl text-ink">${minAvailablePrice}</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">per night, before taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
