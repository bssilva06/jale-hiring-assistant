import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/shared/Button';
import { Briefcase, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-light to-accent/30">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/jale-app-logo.png" 
              alt="Jale Logo" 
              className="h-16 w-auto"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
              Jale <span className="text-primary">AI</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
            {t('landing.title')}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-16">
          {/* Hiring Manager Card */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary overflow-hidden"
          >
            <div className="bg-gradient-to-br from-secondary to-primary p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Briefcase size={48} className="text-accent" />
                <ArrowRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{t('landing.forEmployers')}</h2>
              <p className="text-blue-100 text-lg">{t('landing.employersSubtitle')}</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.employerBenefit1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.employerBenefit2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.employerBenefit3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.employerBenefit4')}</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-lg font-bold shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/dashboard');
                  }}
                >
                  {t('landing.employerCTA')}
                </Button>
              </div>
            </div>
          </div>

          {/* Job Seeker Card */}
          <div 
            onClick={() => navigate('/apply')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary overflow-hidden"
          >
            <div className="bg-gradient-to-br from-primary to-blue-600 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users size={48} className="text-accent" />
                <ArrowRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{t('landing.forJobSeekers')}</h2>
              <p className="text-blue-100 text-lg">{t('landing.workersSubtitle')}</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.workerBenefit1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.workerBenefit2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.workerBenefit3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-3">✓</span>
                  <span className="text-gray-700 text-lg">{t('landing.workerBenefit4')}</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-lg font-bold shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/apply');
                  }}
                >
                  {t('landing.workerCTA')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center mt-20 mb-12">
          <p className="text-gray-600 text-lg mb-6 font-medium">
            {t('landing.builtBy')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="px-4 py-2 bg-white rounded-full shadow">✓ {t('landing.freeToUse')}</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">✓ {t('landing.bilingual')}</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">✓ {t('landing.aiPowered')}</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">✓ {t('landing.communityDriven')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
