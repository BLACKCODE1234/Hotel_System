import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Car, Coffee, Dumbbell, MapPin, Phone, Mail } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section
        className="relative min-h-[92vh] flex items-end text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,33,43,0.35) 0%, rgba(20,33,43,0.72) 100%), url('/homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 animate-rise">
          <p className="section-label text-brass-soft mb-4">LuxuryStay</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] max-w-3xl mb-5">
            A calm stay in the heart of Accra
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-xl mb-10 font-light leading-relaxed">
            Refined rooms, thoughtful service, and an easy path from browsing to booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/booking" className="btn-primary">
              Book a stay
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/70 text-white font-semibold tracking-wide hover:bg-white hover:text-ink transition-colors"
            >
              View rooms
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand-warm border-b border-sand-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
            <div>
              <p className="section-label mb-3">Find your room</p>
              <h2 className="page-title mb-4">Choose the stay that fits your trip</h2>
              <p className="text-ink-muted text-lg max-w-xl leading-relaxed">
                Browse suites by type and rate, then reserve with clear dates and guest details.
              </p>
            </div>
            <div className="panel flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-ink-muted">Independence Avenue, Accra</p>
                <p className="font-display text-2xl text-ink mt-1">Rooms from $149 / night</p>
              </div>
              <Link to="/rooms" className="btn-primary whitespace-nowrap">
                Browse rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="section-label mb-3">On property</p>
            <h2 className="page-title mb-4">What guests use every day</h2>
            <p className="text-ink-muted text-lg leading-relaxed">
              Practical amenities for business trips and quiet weekends—kept simple and reliable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: 'Fast Wi‑Fi', copy: 'Reliable coverage in rooms and public spaces.' },
              { icon: Coffee, title: 'Breakfast', copy: 'Local and continental options each morning.' },
              { icon: Car, title: 'Airport transfer', copy: 'Arranged rides to and from Kotoka.' },
              { icon: Dumbbell, title: 'Fitness room', copy: 'Open early for guests who travel with a routine.' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="border-t border-sand-deep pt-6">
                <Icon className="h-6 w-6 text-brass mb-4" />
                <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>
                <p className="text-ink-muted leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label text-brass-soft mb-3">Location</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-5">
              Central Accra, minutes from the coast
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-8">
              Stay close to Independence Avenue with easy access to business districts and the Atlantic shoreline.
            </p>
            <div className="space-y-3 text-white/80">
              <p className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brass-soft" />
                123 Independence Avenue, Accra Central
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brass-soft" />
                +233 30 123 4567
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brass-soft" />
                reservations@luxurystay.com
              </p>
            </div>
          </div>
          <div
            className="min-h-[320px] border border-white/10"
            style={{
              backgroundImage: "url('/hotel-exterior.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </section>

      <section className="py-20 bg-sand-warm">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="section-label mb-3">Reservations</p>
          <h2 className="page-title mb-5">Ready when you are</h2>
          <p className="text-ink-muted text-lg mb-8 leading-relaxed">
            Select dates, choose a room, and confirm your stay in a few clear steps.
          </p>
          <Link to="/booking" className="btn-primary">
            Start booking
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
