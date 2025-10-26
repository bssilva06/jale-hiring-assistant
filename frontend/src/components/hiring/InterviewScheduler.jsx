import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { interviewsAPI } from '../../services/api';
import Button from '../shared/Button';
import { Calendar, Clock, Video } from 'lucide-react';

const InterviewScheduler = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '30',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const scheduledTime = new Date(`${formData.date}T${formData.time}`);

      const interviewData = {
        application_id: applicationId,
        scheduled_at: scheduledTime.toISOString(),
        duration_minutes: parseInt(formData.duration),
      };

      const response = await interviewsAPI.create(interviewData);
      console.log('Interview scheduled:', response.data);

      alert('Interview scheduled successfully! Candidate will receive confirmation and reminders.');
      navigate('/interviews');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="text-primary" size={32} />
          <h2 className="text-2xl font-bold text-gray-900">Schedule Interview</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Interview Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="input-field"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Interview Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Video size={16} className="inline mr-1" />
              Duration (minutes)
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-field"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📧 Automatic Reminders:</strong> The candidate will receive:
            </p>
            <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
              <li>Immediate confirmation email with Jitsi video link</li>
              <li>24-hour reminder before the interview</li>
              <li>1-hour reminder before the interview</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
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

export default InterviewScheduler;
