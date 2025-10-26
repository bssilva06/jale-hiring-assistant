import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsAPI, interviewsAPI } from '../services/api';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { User, Mail, Phone, Briefcase, Award, FileText, Calendar, Star, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMatchScoreColor, STATUS_LABELS, STATUS_COLORS } from '../utils/constants';

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
    fetchInterviews();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await applicationsAPI.getById(applicationId);
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviews = async () => {
    try {
      const response = await interviewsAPI.getAll();
      // Filter interviews for this application
      const appInterviews = response.data.filter(
        interview => interview.application_id === parseInt(applicationId)
      );
      setInterviews(appInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const MatchScoreBadge = ({ score }) => {
    const color = getMatchScoreColor(score);
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
    };

    return (
      <div className={`${colorClasses[color]} px-4 py-2 rounded-lg text-center`}>
        <div className="text-3xl font-bold">{score}%</div>
        <div className="text-sm">Match Score</div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const colorClass = STATUS_COLORS[status] || 'badge-gray';
    const label = STATUS_LABELS[status] || status;

    return <span className={colorClass}>{label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Not Found</h2>
        <Button onClick={() => navigate('/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const candidate = application.candidate || {};
  const job = application.job || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
          <p className="text-gray-600 mt-1">Review candidate information and qualifications</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/applications')}>
          Back
        </Button>
      </div>

      {/* Match Score & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <MatchScoreBadge score={application.match_score || 0} />
        </Card>
        <Card>
          <div className="text-center">
            <div className="mb-2 text-sm text-gray-600">Status</div>
            <StatusBadge status={application.status} />
          </div>
        </Card>
      </div>

      {/* Candidate Information */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="mr-2" size={24} />
          Candidate Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <p className="text-lg text-gray-900">{candidate.name || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Mail size={14} className="mr-1" />
                Email
              </label>
              <p className="text-gray-900">{candidate.email || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Phone size={14} className="mr-1" />
                Phone
              </label>
              <p className="text-gray-900">{candidate.phone || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Experience</label>
            <p className="text-gray-900">{candidate.experience_years || 0} years</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <Award size={14} className="mr-1" />
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <FileText size={14} className="mr-1" />
              Certifications
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.certifications && candidate.certifications.length > 0 ? (
                candidate.certifications.map((cert, idx) => (
                  <span 
                    key={idx}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No certifications listed</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Language Preference</label>
            <p className="text-gray-900">{candidate.language_preference === 'es' ? 'Spanish' : 'English'}</p>
          </div>
        </div>
      </Card>

      {/* Job Information */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Briefcase className="mr-2" size={24} />
          Applied Position
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">Job Title</label>
            <p className="text-lg text-gray-900">{job.title || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Company</label>
              <p className="text-gray-900">{job.company || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <MapPin size={14} className="mr-1" />
                Location
              </label>
              <p className="text-gray-900">{job.location || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Pay</label>
              <p className="text-gray-900">${job.pay}/hour</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Schedule</label>
              <p className="text-gray-900">{job.schedule || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Application Metadata */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="mr-2" size={24} />
          Application Timeline
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">Submitted</label>
            <p className="text-gray-900">
              {application.created_at 
                ? new Date(application.created_at).toLocaleString()
                : 'N/A'}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Last Updated</label>
            <p className="text-gray-900">
              {application.updated_at 
                ? new Date(application.updated_at).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Interview Feedback */}
      {interviews.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Star className="mr-2" size={24} />
            Interview Feedback
          </h2>
          
          <div className="space-y-6">
            {interviews.map((interview) => (
              <div key={interview.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                {/* Interview Date */}
                <div className="mb-3">
                  <label className="text-sm font-semibold text-gray-700">Interview Date</label>
                  <p className="text-gray-900">
                    {interview.scheduled_time 
                      ? new Date(interview.scheduled_time).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>

                {interview.decision ? (
                  <>
                    {/* Decision */}
                    <div className="mb-3">
                      <label className="text-sm font-semibold text-gray-700">Decision</label>
                      <div className="mt-1">
                        {interview.decision === 'hire' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            <CheckCircle size={16} className="mr-1" />
                            Hire
                          </span>
                        )}
                        {interview.decision === 'maybe' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                            <AlertCircle size={16} className="mr-1" />
                            Maybe
                          </span>
                        )}
                        {interview.decision === 'reject' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                            <XCircle size={16} className="mr-1" />
                            Reject
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {interview.rating && (
                      <div className="mb-3">
                        <label className="text-sm font-semibold text-gray-700">Rating</label>
                        <div className="flex space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={20}
                              className={star <= interview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({interview.rating}/5)</span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {interview.notes && (
                      <div className="mb-3">
                        <label className="text-sm font-semibold text-gray-700">Interviewer Notes</label>
                        <div className="mt-1 bg-gray-50 rounded-lg p-3 text-gray-900 whitespace-pre-wrap">
                          {interview.notes}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Interview scheduled - feedback pending
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="primary"
          onClick={() => navigate(`/interviews/schedule/${application.id}`)}
          className="flex-1"
        >
          <Calendar size={18} className="inline mr-2" />
          Schedule Interview
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/applications')}
          className="flex-1"
        >
          Back to All Applications
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
