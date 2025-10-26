import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import Button from '../shared/Button';
import { Briefcase, DollarSign, MapPin, Clock, FileText } from 'lucide-react';

const JobPostForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pay: '',
    location: '',
    schedule: '',
    requirements: '',
    language: 'en',
  });

  useEffect(() => {
    if (jobId) {
      setIsEditing(true);
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getById(jobId);
      const job = response.data;
      
      // Convert requirements array back to newline-separated string
      const requirementsText = Array.isArray(job.requirements)
        ? job.requirements.join('\n')
        : job.requirements || '';
      
      setFormData({
        title: job.title || '',
        description: job.description || '',
        pay: job.pay || '',
        location: job.location || '',
        schedule: job.schedule || '',
        requirements: requirementsText,
        language: job.language || 'en',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Failed to load job details.');
      navigate('/jobs');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert requirements from textarea to array
      const requirements = formData.requirements
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      const jobData = {
        ...formData,
        pay: parseFloat(formData.pay),
        requirements,
      };

      if (isEditing) {
        // Update existing job
        const response = await jobsAPI.update(jobId, jobData);
        console.log('Job updated:', response.data);
        alert('Job updated successfully!');
      } else {
        // Create new job
        const response = await jobsAPI.create(jobData);
        console.log('Job created:', response.data);
        alert('Job posted successfully! Automated outreach will begin shortly.');
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} job:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} job. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Briefcase className="text-primary" size={32} />
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Job' : 'Post a New Job'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Warehouse Associate"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the role, responsibilities, and what makes it great..."
              className="input-field"
            />
          </div>

          {/* Pay and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Pay (per hour) *
              </label>
              <input
                type="number"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="18.50"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Miami, FL"
                className="input-field"
              />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Schedule *
            </label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              required
              placeholder="e.g., Monday-Friday, 8am-5pm"
              className="input-field"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements * <span className="text-sm text-gray-500">(one per line)</span>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Forklift certification&#10;2+ years warehouse experience&#10;Ability to lift 50 lbs"
              className="input-field"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language for Outreach
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Español (Spanish)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="flex-1"
            >
              {loading 
                ? (isEditing ? 'Updating...' : 'Posting...') 
                : (isEditing ? 'Update Job' : 'Post Job & Start Outreach')
              }
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
