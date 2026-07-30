import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sand-warm border-t border-sand-deep py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="LuxuryStay" className="h-7 w-auto" />
          <span className="font-display text-lg text-ink font-semibold">LuxuryStay</span>
        </Link>
        <p className="text-xs text-ink">&copy; {new Date().getFullYear()} LuxuryStay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
