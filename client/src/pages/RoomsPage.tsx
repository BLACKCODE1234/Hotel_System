import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  description?: string;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80';

const selectClass =
  'w-full border border-sand-deep bg-white px-3 py-2.5 text-ink focus:outline-none focus:border-brass';

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
      if (!response.ok) throw new Error('Failed to load rooms');
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setError('Unable to load rooms from the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div className="min-h-screen bg-sand py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 animate-rise">
          <p className="section-label mb-3">Accommodations</p>
          <h1 className="page-title mb-4">Rooms & suites</h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Clear rates, honest amenities, and rooms sized for how you actually travel.
          </p>
        </div>

        <div className="border border-sand-deep bg-sand-warm p-4 md:p-5 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Price</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectClass}>
                <option value="">All prices</option>
                <option value="100-300">$100 – $300</option>
                <option value="300-500">$300 – $500</option>
                <option value="500+">$500+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Type</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={selectClass}>
                <option value="">All types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="executive">Executive</option>
                <option value="presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Amenity</label>
              <select value={amenity} onChange={(e) => setAmenity(e.target.value)} className={selectClass}>
                <option value="">Any</option>
                <option value="Ocean View">Ocean View</option>
                <option value="Balcony">Balcony</option>
                <option value="Jacuzzi">Jacuzzi</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={loadRooms} className="w-full btn-primary">
                Apply
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 border border-[#E8C9C3] bg-[#F8EDEA] px-4 py-3 text-[#8B3A32]">{error}</div>
        )}

        {loading ? (
          <p className="text-ink-muted">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <div className="panel text-center py-16">
            <p className="font-display text-3xl text-ink mb-2">No rooms match</p>
            <p className="text-ink-muted mb-6">Try widening your filters.</p>
            <button
              onClick={() => {
                setPriceRange('');
                setRoomType('');
                setAmenity('');
                setTimeout(loadRooms, 0);
              }}
              className="btn-secondary"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="group grid lg:grid-cols-[1.15fr_1fr] border border-sand-deep bg-white overflow-hidden"
              >
                <div className="overflow-hidden min-h-[260px]">
                  <img
                    src={room.image || fallbackImage}
                    alt={room.name}
                    className="w-full h-full object-cover img-zoom"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-brass mb-2">{room.type}</p>
                      <h2 className="font-display text-3xl text-ink">{room.name}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-3xl text-ink">${room.price}</p>
                      <p className="text-sm text-ink-muted">per night</p>
                    </div>
                  </div>
                  <p className="text-sm text-ink-muted mb-5">
                    {room.rating > 0
                      ? `${room.rating.toFixed(1)} guest rating · ${room.reviews} reviews`
                      : 'Recently listed'}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted mb-8">
                    {(room.amenities || []).slice(0, 6).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Link to={`/hotel/1`} className="btn-secondary flex-1">
                      Property details
                    </Link>
                    <Link
                      to="/booking"
                      className="btn-primary flex-1"
                      onClick={() => {
                        localStorage.setItem(
                          'selectedBooking',
                          JSON.stringify({
                            room: { id: room.id, name: room.name, type: room.type, price: { base: room.price } },
                          }),
                        );
                      }}
                    >
                      Book this room
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
