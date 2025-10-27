import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobsAPI } from '../services/api';
import { translateJob, translateJobs } from '../utils/translator';
import ApplicationForm from '../components/candidate/ApplicationForm';
import ChatBot from '../components/candidate/ChatBot';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { Briefcase, DollarSign, MapPin, Clock, CheckCircle, Search, TrendingUp } from 'lucide-react';

const CandidatePortal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    } else {
      fetchAllJobs();
    }
  }, [jobId]);

  // Translate jobs when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (i18n.language) {
        setTranslating(true);
        
        // Translate all jobs if we have them
        if (jobs.length > 0) {
          const translated = await translateJobs(jobs, i18n.language);
          setJobs(translated);
        }
        
        // Translate single job if we have it
        if (job) {
          const translated = await translateJob(job, i18n.language);
          setJob(translated);
        }
        
        // Translate selected job if we have it
        if (selectedJob) {
          const translated = await translateJob(selectedJob, i18n.language);
          setSelectedJob(translated);
        }
        
        setTranslating(false);
      }
    };
    
    translateContent();
  }, [i18n.language]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getById(jobId);
      const jobData = response.data;
      
      // Translate if needed
      const translatedJob = await translateJob(jobData, i18n.language);
      setJob(translatedJob);
      setSelectedJob(translatedJob);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      const jobsData = response.data;
      
      // Translate if needed
      const translatedJobs = await translateJobs(jobsData, i18n.language);
      setJobs(translatedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Translation Indicator */}
        {translating && (
          <div className="fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm font-medium">🌐 Translating...</span>
          </div>
        )}

        {/* If browsing jobs (no jobId), show job listings */}
        {!jobId && !selectedJob && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('candidatePortal.availableJobs')}</h1>
                <p className="text-gray-600">{t('candidatePortal.browseAndApply')}</p>
              </div>
              <Button 
                variant="primary"
                onClick={() => navigate('/apply/match')}
                className="flex items-center"
              >
                <TrendingUp size={18} className="mr-2" />
                {t('candidatePortal.findMyMatch')}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((jobItem) => (
                <Card 
                  key={jobItem.id}
                  hoverable
                  onClick={() => setSelectedJob(jobItem)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-gray-900">{jobItem.title}</h3>
                      <Briefcase className="text-primary" size={24} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-2 text-green-600" />
                        <span className="font-semibold text-green-700">${jobItem.pay}/hr</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span>{jobItem.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>{jobItem.schedule}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2">{jobItem.description}</p>

                    <button className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4">
                      {t('candidatePortal.viewAndApply')}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Job Details */}
        {(job || selectedJob) && (
          <Card className="mb-8">
            {selectedJob && !jobId && (
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-primary hover:text-secondary mb-4 font-semibold"
              >
                ← {t('candidatePortal.backToAllJobs')}
              </button>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{(job || selectedJob).title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <DollarSign size={18} className="mr-1" />
                    <span>${(job || selectedJob).pay}/hour</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-1" />
                    <span>{(job || selectedJob).location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-1" />
                    <span>{(job || selectedJob).schedule}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{(job || selectedJob).description}</p>

                {(job || selectedJob).requirements && (job || selectedJob).requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('candidatePortal.requirements')}</h3>
                    <ul className="space-y-1">
                      {(job || selectedJob).requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Application Form - only show when job is selected */}
        {(job || selectedJob) && (
          <ApplicationForm jobId={jobId || (selectedJob && selectedJob.id)} />
        )}

        {/* ChatBot - only show when a job is selected */}
        {(jobId || selectedJob) && (
          <ChatBot jobId={jobId || (selectedJob && selectedJob.id)} />
        )}
      </div>
    </div>
  );
};


export default CandidatePortal;
