import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { candidatesAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../shared/Button';
import { User, Mail, Phone, Award, FileText, Languages, Upload, Loader, CheckCircle } from 'lucide-react';

const ApplicationForm = ({ jobId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [attachedResume, setAttachedResume] = useState(null); // Store resume file
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience_years: '',
    certifications: '',
    education: '',
    language_preference: 'en',
    resume_url: '',
  });

  // Pre-fill form from navigation state (from JobMatcher)
  useEffect(() => {
    if (location.state?.prefillData) {
      const prefill = location.state.prefillData;
      setFormData(prev => ({
        ...prev,
        name: prefill.name || prev.name,
        email: prefill.email || prev.email,
        phone: prefill.phone || prev.phone,
        experience_years: prefill.experience_years?.toString() || prev.experience_years,
        skills: Array.isArray(prefill.skills) ? prefill.skills.join('\n') : prefill.skills || prev.skills,
        certifications: Array.isArray(prefill.certifications) ? prefill.certifications.join('\n') : prefill.certifications || prev.certifications,
        education: prefill.education || prev.education,
        language_preference: prefill.language_preference || prev.language_preference,
      }));
    }

    // Get uploaded resume from navigation state
    if (location.state?.uploadedResume) {
      setAttachedResume(location.state.uploadedResume);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.warning('Please upload a PDF or TXT file. DOC/DOCX support coming soon!');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setParsingResume(true);

    try {
      // Store the file
      setAttachedResume(file);

      // Create FormData to send file
      const formData = new FormData();
      formData.append('resume', file);

      // Send to backend for parsing
      const response = await fetch('http://localhost:5000/api/candidates/parse-resume-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const parsedData = await response.json();
      console.log('Parsed resume data:', parsedData);

      // Auto-populate form fields
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        skills: parsedData.skills?.join('\n') || prev.skills,
        experience_years: parsedData.experience_years?.toString() || prev.experience_years,
        certifications: parsedData.certifications?.join('\n') || prev.certifications,
        education: parsedData.education || prev.education,
      }));

      toast.success('Resume parsed successfully! Resume will be attached to your application.');
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast.error(error.message || 'Failed to parse resume. Please fill out the form manually.');
      setAttachedResume(null); // Clear on error
    } finally {
      setParsingResume(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert skills and certifications from textarea to array
      const skills = formData.skills
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const certifications = formData.certifications
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const candidateData = {
        ...formData,
        skills,
        certifications,
        experience_years: parseInt(formData.experience_years) || 0,
      };

      // Add resume information if a file was uploaded
      if (attachedResume) {
        // For now, store the filename as a placeholder
        // In production, you would upload to Supabase Storage and get a URL
        candidateData.resume_url = `resume-${Date.now()}-${attachedResume.name}`;
        console.log('Resume attached:', attachedResume.name);
      } else if (formData.resume_url) {
        // Use the manually entered URL if provided
        candidateData.resume_url = formData.resume_url;
      }

      // If jobId is provided, also create application
      const response = await candidatesAPI.create({
        ...candidateData,
        job_id: jobId,
      });

      console.log('Application submitted:', response.data);

      // Navigate to success page
      navigate('/apply/success');
    } catch (error) {
      console.error('Error submitting application:', error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        toast.warning('You have already applied for this job. You can only submit one application per job position.');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="text-primary" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('application.applyForPosition')}</h2>
            <p className="text-gray-600">{t('application.fillOutForm')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {t('application.personalInfo')}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                {t('application.fullName')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('application.namePlaceholder')}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('application.emailPlaceholder')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  {t('application.phoneNumber')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder={t('application.phonePlaceholder')}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Languages size={16} className="inline mr-1" />
                {t('application.preferredLanguage')}
              </label>
              <select
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                className="input-field"
              >
                <option value="en">{t('jobForm.english')}</option>
                <option value="es">{t('jobForm.spanish')}</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {t('application.experienceSkills')}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('application.yearsOfExperience')} *
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                required
                min="0"
                placeholder={t('application.yearsPlaceholder')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('application.skills')} * <span className="text-sm text-gray-500">{t('application.skillsHelper')}</span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                rows={4}
                placeholder={t('application.skillsPlaceholder')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award size={16} className="inline mr-1" />
                {t('application.certifications')} <span className="text-sm text-gray-500">{t('application.certificationsHelper')}</span>
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={3}
                placeholder={t('application.certificationsPlaceholder')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('application.resumeUrl')} <span className="text-sm text-gray-500">{t('application.resumeUrlHelper')}</span>
              </label>
              <input
                type="url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                placeholder={t('application.resumeUrlPlaceholder')}
                className="input-field"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {t('application.resume')}
            </h3>

            {attachedResume ? (
              // Show attached resume
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
                <div className="text-center">
                  <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('application.resumeAttached')}
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>{attachedResume.name}</strong> ({(attachedResume.size / 1024).toFixed(1)} KB)
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        disabled={parsingResume}
                        className="hidden"
                      />
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                        <Upload size={18} />
                        <span>{t('application.replace')}</span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAttachedResume(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      {t('application.remove')}
                    </button>
                  </div>

                  <p className="text-xs text-green-700 mt-3">
                    ✓ {t('application.resumeWillBeSubmitted')}
                  </p>
                </div>
              </div>
            ) : (
              // Show upload prompt
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto text-blue-500 mb-3" size={48} />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('application.uploadResume')}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('application.resumeDescription')}
                  </p>

                  <div className="flex items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        disabled={parsingResume}
                        className="hidden"
                      />
                      <div className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                        {parsingResume ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            <span>{t('application.parsingResume')}</span>
                          </>
                        ) : (
                          <>
                            <Upload size={20} />
                            <span>{t('application.chooseFile')}</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    {t('application.supportedFormats')}
                  </p>
                </div>
              </div>
            )}

            {!attachedResume && (
              <div className="text-center text-sm text-gray-500">
                <span>{t('application.fillManually')}</span>
              </div>
            )}
          </div>

          {/* AI Chatbot Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💬 {t('application.chatbotInfo')}</strong>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? t('application.submitting') : t('application.submitApplication')}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              {t('jobForm.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
