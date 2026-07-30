import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Star, MessageCircle, ChevronDown, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const lightNav = isHome && !scrolled;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const linkClass = lightNav
    ? 'px-3 py-2 text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors'
    : 'px-3 py-2 text-sm font-medium tracking-wide text-ink-muted hover:text-ink transition-colors';

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || !isHome
          ? 'bg-sand-warm/95 border-b border-sand-deep backdrop-blur-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="LuxuryStay" className="h-10 w-auto" />
          </Link>

          {isHome ? (
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/rooms" className={linkClass}>
                Rooms
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className={linkClass}>
                    My Stay
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost text-sm">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkClass}>
                    Sign in
                  </Link>
                  <Link to="/signup" className="btn-primary ml-2">
                    Join
                  </Link>
                </>
              )}
              <Link to="/booking" className="btn-primary ml-2">
                Book a stay
              </Link>
            </nav>
          ) : isAuthPage ? (
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className={linkClass}>
                Home
              </Link>
              <Link to="/rooms" className={linkClass}>
                Rooms
              </Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className={linkClass}>
                Home
              </Link>
              <Link to="/rooms" className={linkClass}>
                Rooms
              </Link>
              <Link to="/booking" className="btn-primary ml-3 mr-2">
                Book
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink">
                  <User className="h-4 w-4" />
                  Account
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-52 bg-white border border-sand-deep opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-ink-muted hover:bg-sand hover:text-ink">
                      <User className="h-4 w-4 mr-3" /> Profile
                    </Link>
                    <Link to="/history" className="flex items-center px-4 py-2.5 text-sm text-ink-muted hover:bg-sand hover:text-ink">
                      <Calendar className="h-4 w-4 mr-3" /> History
                    </Link>
                    <Link to="/rewards" className="flex items-center px-4 py-2.5 text-sm text-ink-muted hover:bg-sand hover:text-ink">
                      <Star className="h-4 w-4 mr-3" /> Rewards
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm text-ink-muted hover:bg-sand hover:text-ink">
                      <Settings className="h-4 w-4 mr-3" /> Settings
                    </Link>
                    <Link to="/support" className="flex items-center px-4 py-2.5 text-sm text-ink-muted hover:bg-sand hover:text-ink">
                      <MessageCircle className="h-4 w-4 mr-3" /> Support
                    </Link>
                    <div className="border-t border-sand-deep my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-[#8B3A32] hover:bg-sand"
                    >
                      <LogOut className="h-4 w-4 mr-3" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          )}

          <button
            className={`md:hidden p-2 ${lightNav ? 'text-white' : 'text-ink'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sand-deep bg-sand-warm">
            <nav className="flex flex-col gap-1">
              <Link to="/" className="px-4 py-3 text-ink" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/rooms" className="px-4 py-3 text-ink" onClick={() => setIsMenuOpen(false)}>
                Rooms
              </Link>
              <Link to="/booking" className="px-4 py-3 text-ink" onClick={() => setIsMenuOpen(false)}>
                Book a stay
              </Link>
              {!isAuthPage && (
                <>
                  <Link to="/profile" className="px-4 py-3 text-ink-muted" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/history" className="px-4 py-3 text-ink-muted" onClick={() => setIsMenuOpen(false)}>
                    History
                  </Link>
                  <Link to="/support" className="px-4 py-3 text-ink-muted" onClick={() => setIsMenuOpen(false)}>
                    Support
                  </Link>
                </>
              )}
              {user ? (
                <button onClick={handleLogout} className="px-4 py-3 text-left text-[#8B3A32]">
                  Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 text-ink" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/signup" className="mx-4 mt-2 btn-primary" onClick={() => setIsMenuOpen(false)}>
                    Join
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
