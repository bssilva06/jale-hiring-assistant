import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { Briefcase, DollarSign, MapPin, Clock, Plus, Edit, Trash2 } from 'lucide-react';

const ActiveJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, closed

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to close this job posting?')) {
      try {
        await jobsAPI.delete(jobId);
        fetchJobs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to close job posting');
      }
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'active') return job.status === 'active';
    if (filter === 'closed') return job.status === 'closed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
          <p className="text-gray-600">Manage your active and closed job listings</p>
        </div>
        <Button onClick={() => navigate('/jobs/new')}>
          <Plus size={20} className="mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({jobs.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active ({jobs.filter((j) => j.status === 'active').length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'closed'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Closed ({jobs.filter((j) => j.status === 'closed').length})
        </button>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'active'
                ? 'No active job postings at the moment.'
                : filter === 'closed'
                ? 'No closed job postings.'
                : 'Start by creating your first job posting.'}
            </p>
            {filter === 'all' && (
              <Button onClick={() => navigate('/jobs/new')}>
                <Plus size={20} className="mr-2" />
                Create First Job
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} hoverable>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-green-600" />
                    <span className="font-semibold text-green-700">${job.pay}/hr</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>{job.schedule}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>

                {/* Requirements Preview */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


export default ActiveJobs;
