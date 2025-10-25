import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesAPI } from '../../services/api';
import Button from '../shared/Button';
import { User, Mail, Phone, Award, FileText, Languages } from 'lucide-react';

const ApplicationForm = ({ jobId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience_years: '',
    certifications: '',
    language_preference: 'en',
    resume_url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      alert('Failed to submit application. Please try again.');
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
            <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
            <p className="text-gray-600">Fill out the form below to submit your application</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
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
                  placeholder="john@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Languages size={16} className="inline mr-1" />
                Preferred Language
              </label>
              <select
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                className="input-field"
              >
                <option value="en">English</option>
                <option value="es">Español (Spanish)</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Experience & Skills
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                required
                min="0"
                placeholder="3"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * <span className="text-sm text-gray-500">(one per line)</span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Forklift operation&#10;Inventory management&#10;Warehouse safety&#10;Team leadership"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award size={16} className="inline mr-1" />
                Certifications <span className="text-sm text-gray-500">(one per line, if any)</span>
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={3}
                placeholder="Forklift Certified&#10;OSHA Safety Training&#10;First Aid & CPR"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume URL <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <input
                type="url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                placeholder="https://drive.google.com/your-resume"
                className="input-field"
              />
            </div>
          </div>

          {/* AI Chatbot Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💬 Have questions?</strong> Click the chat button in the bottom-right corner to ask our AI assistant about pay, schedule, location, or requirements!
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
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
