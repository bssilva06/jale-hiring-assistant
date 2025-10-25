import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { Briefcase, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="text-primary" size={64} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary">Jale AI</span>
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered hiring assistant that connects great talent with great opportunities
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidate Card */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-primary"
            onClick={() => navigate('/apply')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                I'm Looking for a Job
              </h2>
              <p className="text-gray-600 mb-6">
                Find your perfect job opportunity. Apply to positions, chat with our AI assistant, and get matched with roles that fit your skills.
              </p>
              <ul className="text-left space-y-2 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Browse job openings
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Chat with AI in English or Spanish
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Get instant match scores
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Schedule video interviews
                </li>
              </ul>
              <Button 
                variant="success" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/apply');
                }}
              >
                Apply for Jobs
                <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </div>
          </div>

          {/* Hiring Manager Card */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-primary"
            onClick={() => navigate('/dashboard')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-primary" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                I'm Hiring
              </h2>
              <p className="text-gray-600 mb-6">
                Post jobs, review candidates with AI-powered matching, schedule interviews, and manage your entire hiring pipeline.
              </p>
              <ul className="text-left space-y-2 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Post jobs with automated outreach
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  AI-powered candidate matching
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Schedule & conduct video interviews
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Track hiring pipeline
                </li>
              </ul>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
                <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Powered by AI • Bilingual Support (English & Spanish) • Video Interviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
