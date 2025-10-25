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
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="text-primary" size={32} />
            <span className="text-2xl font-bold text-gray-900">
              Jale <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isHiringManager ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/jobs/new" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/jobs/new' 
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Post Job
                </Link>
                <Link 
                  to="/candidates" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/candidates' 
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Candidates
                </Link>
                <Link 
                  to="/interviews" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/interviews' 
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Interviews
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-primary font-medium transition-colors"
                  title="Back to Home"
                >
                  <Home size={20} />
                </button>
              </>
            ) : isCandidate ? (
              <>
                <Link 
                  to="/apply" 
                  className={`font-medium transition-colors ${
                    location.pathname.startsWith('/apply')
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Browse Jobs
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1"
                >
                  <Home size={18} />
                  <span>Back to Home</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button - Only show for hiring managers */}
          {isHiringManager && (
            <button 
              onClick={onMenuClick}
              className="md:hidden text-gray-600 hover:text-primary"
            >
              <Menu size={24} />
            </button>
          )}
          
          {/* Mobile Home Button for Candidates */}
          {isCandidate && (
            <button
              onClick={() => navigate('/')}
              className="md:hidden text-gray-600 hover:text-primary"
            >
              <Home size={24} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
