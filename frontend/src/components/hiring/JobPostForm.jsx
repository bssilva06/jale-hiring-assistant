import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../shared/Button';
import { Briefcase, DollarSign, MapPin, Clock, FileText } from 'lucide-react';

const JobPostForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const toast = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    pay: '',
    location: '',
    job_type: 'Full-time',
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
        company: job.company || '',
        description: job.description || '',
        pay: job.pay || '',
        location: job.location || '',
        job_type: job.job_type || 'Full-time',
        schedule: job.schedule || '',
        requirements: requirementsText,
        language: job.language || 'en',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details.');
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
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        const response = await jobsAPI.create(jobData);
        console.log('Job created:', response.data);
        toast.success('Job posted successfully! Automated outreach will begin shortly.');
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} job:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} job. Please try again.`);
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
            {isEditing ? t('jobForm.editJob') : t('jobForm.postNewJob')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('jobForm.jobTitle')} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t('jobForm.jobTitlePlaceholder')}
              className="input-field"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-1" />
              {t('jobForm.companyName')} *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder={t('jobForm.companyPlaceholder')}
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              {t('jobForm.jobDescription')} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder={t('jobForm.descriptionPlaceholder')}
              className="input-field"
            />
          </div>

          {/* Pay and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                {t('jobForm.pay')} *
              </label>
              <input
                type="number"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder={t('jobForm.payPlaceholder')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                {t('jobForm.location')} *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder={t('jobForm.locationPlaceholder')}
                className="input-field"
              />
            </div>
          </div>

          {/* Job Type and Schedule Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-1" />
                {t('jobForm.jobType')} *
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="Full-time">{t('jobForm.fullTime')}</option>
                <option value="Part-time">{t('jobForm.partTime')}</option>
                <option value="Contract">{t('jobForm.contract')}</option>
                <option value="Temporary">{t('jobForm.temporary')}</option>
                <option value="Seasonal">{t('jobForm.seasonal')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                {t('jobForm.schedule')} *
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                required
                placeholder={t('jobForm.schedulePlaceholder')}
                className="input-field"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('jobForm.requirements')} * <span className="text-sm text-gray-500">{t('jobForm.requirementsHelper')}</span>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={5}
              placeholder={t('jobForm.requirementsPlaceholder')}
              className="input-field"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('jobForm.language')}
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input-field"
            >
              <option value="en">{t('jobForm.english')}</option>
              <option value="es">{t('jobForm.spanish')}</option>
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
                ? (isEditing ? t('jobForm.updating') : t('jobForm.posting')) 
                : (isEditing ? t('jobForm.updateJob') : t('jobForm.postJob'))
              }
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              {t('jobForm.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
