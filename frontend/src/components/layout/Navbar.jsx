import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, Home } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHiringManager = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/jobs') ||
                          location.pathname.startsWith('/interviews') ||
                          location.pathname.startsWith('/candidates') ||
                          location.pathname.startsWith('/applications');
  
  const isCandidate = location.pathname.startsWith('/apply');

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40 border-b-4 border-primary">
      <div className="container-custom">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/jale-app-logo.png" 
              alt="Jale Logo" 
              className="h-10 w-auto group-hover:scale-110 transition-transform"
            />
            <span className="text-3xl font-extrabold text-gray-900">
              Jale <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isHiringManager ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/dashboard' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/jobs/new" 
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/jobs/new' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  Post Job
                </Link>
                <Link 
                  to="/candidates" 
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/candidates' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  Candidates
                </Link>
                <Link 
                  to="/interviews" 
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/interviews' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  Interviews
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-700 hover:text-primary font-bold transition-colors ml-2"
                  title="Back to Home"
                >
                  <Home size={24} />
                </button>
              </>
            ) : isCandidate ? (
              <>
                <Link 
                  to="/apply" 
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    location.pathname.startsWith('/apply')
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  Browse Jobs
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-700 hover:text-primary font-bold transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <Home size={20} />
                  <span>Back to Home</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button - Only show for hiring managers */}
          {isHiringManager && (
            <button 
              onClick={onMenuClick}
              className="md:hidden text-gray-700 hover:text-primary p-2"
            >
              <Menu size={28} />
            </button>
          )}
          
          {/* Mobile Home Button for Candidates */}
          {isCandidate && (
            <button
              onClick={() => navigate('/')}
              className="md:hidden text-gray-700 hover:text-primary p-2"
            >
              <Home size={28} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
