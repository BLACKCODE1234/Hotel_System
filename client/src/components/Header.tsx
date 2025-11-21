import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hotel, Menu, X, User, LogOut, Settings, Star, MessageCircle, ChevronDown, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  // Simulate user authentication state (in real app, this would come from context/state management)
  const isLoggedIn = location.pathname === '/dashboard';
  const isHome = location.pathname === '/';

  return (
    <header 
      className="sticky top-0 z-50 animate-slide-up"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Hotel 
                className="h-10 w-10 transition-colors duration-300" 
                style={{color: '#1e40af'}}
              />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">LuxuryStay</span>
          </Link>

          {/* Desktop Navigation */}
          {isHome ? (
            <nav className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-full hover:bg-gray-50"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-md hover:bg-gray-50"
              >
                Home
              </Link>
              <Link 
                to="/rooms" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-md hover:bg-gray-50"
              >
                Rooms
              </Link>
              
              {/* Account Dropdown */}
              <div className="relative group ml-4">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-md hover:bg-gray-50">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link 
                      to="/profile"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link 
                      to="/history"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      History
                    </Link>
                    <Link 
                      to="/rewards"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Star className="h-4 w-4 mr-3" />
                      Rewards
                    </Link>
                    <Link 
                      to="/settings"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <Link 
                      to="/support"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <MessageCircle className="h-4 w-4 mr-3" />
                      Support
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link 
                      to="/"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-3 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300 transform hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {isHome ? (
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </nav>
            ) : (
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/rooms" 
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rooms
                </Link>
                
                {/* Mobile Account Section */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Account</div>
                  <Link 
                    to="/profile"
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <Link 
                    to="/history"
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4 mr-3" />
                    History
                  </Link>
                  <Link 
                    to="/rewards"
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star className="h-4 w-4 mr-3" />
                    Rewards
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                  <Link 
                    to="/support"
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Support
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors rounded-md hover:bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Link>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
