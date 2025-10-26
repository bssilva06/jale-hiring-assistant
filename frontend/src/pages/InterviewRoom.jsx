import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewsAPI } from '../services/api';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, Star, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    decision: '',
    rating: 5,
    notes: '',
  });

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      const response = await interviewsAPI.getById(interviewId);
      setInterview(response.data);
      
      // Only show feedback if there's already a saved decision
      // Don't auto-show on page load
      if (response.data.decision && response.data.status === 'completed') {
        setShowFeedback(true);
        setFeedback({
          decision: response.data.decision,
          rating: response.data.rating || 5,
          notes: response.data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await interviewsAPI.updateDecision(
        interviewId,
        feedback.decision,
        feedback.notes,
        feedback.rating
      );

      alert('Feedback saved successfully!');
      navigate('/interviews');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    }
  };

  const handleJitsiAPI = (api) => {
    // You can add event listeners here
    api.addEventListener('videoConferenceJoined', () => {
      console.log('Video conference joined');
    });

    // Don't auto-trigger feedback when leaving - user can manually click "End Interview"
    // api.addEventListener('videoConferenceLeft', () => {
    //   console.log('Video conference left');
    //   setShowFeedback(true);
    // });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Not Found</h2>
          <Button onClick={() => navigate('/interviews')}>
            Back to Interviews
          </Button>
        </Card>
      </div>
    );
  }

  const roomName = interview.jitsi_room_id || `jale-interview-${interviewId}`;
  const directJitsiLink = `https://meet.jit.si/${roomName}`;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container-custom py-4">
        {/* Quick Join Option */}
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900">Alternative: Open in New Window</h3>
              <p className="text-sm text-blue-700">If the embedded meeting doesn't work, open it in a new window:</p>
            </div>
            <Button
              variant="primary"
              onClick={() => window.open(directJitsiLink, '_blank')}
            >
              <Video size={16} className="mr-2" />
              Open Meeting
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <Card className="p-0 overflow-hidden h-[600px]">
              {!showFeedback ? (
                <JitsiMeeting
                  domain="meet.jit.si"
                  roomName={roomName}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableModeratorIndicator: true,
                    enableEmailInStats: false,
                    enableWelcomePage: false,
                    requireDisplayName: false,
                    hideConferenceSubject: false,
                    hideConferenceTimer: false,
                    startAudioOnly: false,
                    startScreenSharing: false,
                    enableClosePage: false,
                    disableInviteFunctions: true,
                    enableNoisyMicDetection: false,
                    fileRecordingsEnabled: false,
                    liveStreamingEnabled: false,
                    transcribingEnabled: false,
                    disableProfile: true,
                    disableRemoteMute: false,
                  }}
                  interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_POWERED_BY: false,
                    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                    SHOW_CHROME_EXTENSION_BANNER: false,
                    MOBILE_APP_PROMO: false,
                    DISABLE_PRESENCE_STATUS: true,
                    DISABLE_FOCUS_INDICATOR: false,
                    DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
                    DISABLE_TRANSCRIPTION_SUBTITLES: false,
                    DISABLE_RINGING: false,
                    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
                    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
                    POLICY_LOGO: null,
                    DEFAULT_BACKGROUND: '#474747',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'You',
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
                    DEFAULT_LOGO_URL: '',
                    TOOLBAR_BUTTONS: [
                      'microphone', 'camera', 'desktop', 'fullscreen',
                      'fodeviceselection', 'hangup', 'chat',
                      'raisehand', 'videoquality', 'filmstrip', 
                      'tileview', 'shortcuts',
                    ],
                  }}
                  userInfo={{
                    displayName: 'Interviewer',
                  }}
                  onApiReady={handleJitsiAPI}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '600px';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <Video size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interview Ended</h3>
                    <p className="text-gray-600">Please provide your feedback below</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Feedback Form */}
            {showFeedback && (
              <Card className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Feedback</h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {/* Decision */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFeedback(prev => ({ ...prev, decision: 'hire' }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          feedback.decision === 'hire'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <CheckCircle 
                          size={24} 
                          className={`mx-auto mb-1 ${
                            feedback.decision === 'hire' ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm font-semibold">Hire</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedback(prev => ({ ...prev, decision: 'maybe' }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          feedback.decision === 'maybe'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-300 hover:border-yellow-300'
                        }`}
                      >
                        <AlertCircle 
                          size={24} 
                          className={`mx-auto mb-1 ${
                            feedback.decision === 'maybe' ? 'text-yellow-600' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm font-semibold">Maybe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedback(prev => ({ ...prev, decision: 'reject' }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          feedback.decision === 'reject'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-red-300'
                        }`}
                      >
                        <XCircle 
                          size={24} 
                          className={`mx-auto mb-1 ${
                            feedback.decision === 'reject' ? 'text-red-600' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm font-semibold">Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5) *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText size={16} className="inline mr-1" />
                      Interview Notes
                    </label>
                    <textarea
                      value={feedback.notes}
                      onChange={(e) => setFeedback(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      placeholder="Add any observations, strengths, concerns, or next steps..."
                      className="input-field"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex space-x-3">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={!feedback.decision}
                      className="flex-1"
                    >
                      Save Feedback
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/interviews')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Sidebar - Candidate Info */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Candidate Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{interview.candidate?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm">{interview.candidate?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-sm">{interview.candidate?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-semibold">{interview.job?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Match Score</p>
                  <p className="text-2xl font-bold text-primary">
                    {interview.application?.match_score || 0}%
                  </p>
                </div>
                {interview.application?.strengths && interview.application.strengths.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {interview.application.strengths.slice(0, 3).map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle size={16} className="text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {!showFeedback && (
                <Button
                  variant="secondary"
                  className="w-full mt-6"
                  onClick={() => setShowFeedback(true)}
                >
                  End Interview
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
