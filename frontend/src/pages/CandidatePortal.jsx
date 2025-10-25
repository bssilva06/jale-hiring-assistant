import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import ApplicationForm from '../components/candidate/ApplicationForm';
import ChatBot from '../components/candidate/ChatBot';
import Card from '../components/shared/Card';
import { Briefcase, DollarSign, MapPin, Clock, CheckCircle } from 'lucide-react';

const CandidatePortal = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    } else {
      setLoading(false);
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getById(jobId);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Job Details */}
        {job && (
          <Card className="mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <DollarSign size={18} className="mr-1" />
                    <span>${job.pay}/hour</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-1" />
                    <span>{job.schedule}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                    <ul className="space-y-1">
                      {job.requirements.map((req, idx) => (
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

        {/* Application Form */}
        <ApplicationForm jobId={jobId} />

        {/* ChatBot */}
        <ChatBot jobId={jobId} />
      </div>
    </div>
  );
};

export default CandidatePortal;
