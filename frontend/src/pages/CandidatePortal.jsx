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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    } else {
      fetchAllJobs();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getById(jobId);
      setJob(response.data);
      setSelectedJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Use mock data for demo
      setJobs(mockJobs);
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
        {/* If browsing jobs (no jobId), show job listings */}
        {!jobId && !selectedJob && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Jobs</h1>
              <p className="text-gray-600">Browse open positions and apply today!</p>
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
                      View & Apply
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
                ← Back to all jobs
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
                    <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
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

        {/* ChatBot */}
        <ChatBot jobId={jobId} />
      </div>
    </div>
  );
};

// Mock jobs data for demo
const mockJobs = [
  {
    id: 1,
    title: 'Construction Foreman',
    pay: 32,
    location: 'Austin, TX',
    schedule: 'Full-time, Mon-Fri',
    description: 'Seeking experienced construction foreman to lead commercial building projects. Must have strong leadership skills and 5+ years of construction experience.',
    requirements: [
      '5+ years of construction experience',
      'OSHA safety certification',
      'Team leadership experience',
      'Blueprint reading skills',
      'Valid driver\'s license'
    ]
  },
  {
    id: 2,
    title: 'Electrician - Commercial',
    pay: 28,
    location: 'San Antonio, TX',
    schedule: 'Full-time, Mon-Fri',
    description: 'Licensed electrician needed for commercial electrical installations and maintenance. Work on office buildings, retail spaces, and industrial facilities.',
    requirements: [
      'Licensed Master or Journeyman Electrician',
      'Commercial wiring experience',
      'Code compliance knowledge',
      'Troubleshooting skills',
      'Own basic hand tools'
    ]
  },
  {
    id: 3,
    title: 'Plumber',
    pay: 26,
    location: 'Houston, TX',
    schedule: 'Full-time, Mon-Sat',
    description: 'Residential and commercial plumber needed. Install, repair, and maintain plumbing systems. Service calls and new construction work.',
    requirements: [
      'Plumbing license or apprentice certificate',
      '3+ years experience',
      'Pipe installation and repair',
      'Water heater experience',
      'Customer service skills'
    ]
  },
  {
    id: 4,
    title: 'Carpenter - Residential',
    pay: 24,
    location: 'Dallas, TX',
    schedule: 'Full-time, Mon-Fri',
    description: 'Skilled carpenter for custom home building. Framing, finish work, cabinetry, and trim installation. High-end residential projects.',
    requirements: [
      'Carpentry experience (framing & finish)',
      'Blueprint reading',
      'Own tools',
      'Attention to detail',
      'Reliable transportation'
    ]
  },
  {
    id: 5,
    title: 'HVAC Technician',
    pay: 30,
    location: 'Fort Worth, TX',
    schedule: 'Full-time, Mon-Fri + On-call',
    description: 'Install, maintain, and repair HVAC systems in commercial buildings. Diagnose issues and perform preventive maintenance.',
    requirements: [
      'EPA certification (Universal preferred)',
      'HVAC installation & repair experience',
      'Electrical troubleshooting',
      'Customer service',
      'Clean driving record'
    ]
  },
  {
    id: 6,
    title: 'Welder - Industrial',
    pay: 27,
    location: 'Corpus Christi, TX',
    schedule: 'Full-time, Rotating shifts',
    description: 'Industrial welder for manufacturing facility. MIG, TIG, and Stick welding on steel structures and equipment.',
    requirements: [
      'Welding certification',
      'Blueprint reading',
      '2+ years industrial welding',
      'Safety conscious',
      'Pass weld test'
    ]
  },
];

export default CandidatePortal;
