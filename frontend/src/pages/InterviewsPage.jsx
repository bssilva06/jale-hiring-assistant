import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewsAPI } from '../services/api';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { Calendar, Clock, Video, User, Briefcase, MapPin, Phone, Mail } from 'lucide-react';
import { format, isPast, isFuture, isToday, parseISO } from 'date-fns';

const InterviewsPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await interviewsAPI.getAll();
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // Use mock data for demo
      setInterviews(mockInterviews);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (scheduledTime) => {
    const date = new Date(scheduledTime);
    const now = new Date();
    
    if (isPast(date)) {
      return <span className="badge-gray">Completed</span>;
    } else if (isToday(date)) {
      return <span className="badge-warning">Today</span>;
    } else {
      return <span className="badge-success">Upcoming</span>;
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const date = new Date(interview.scheduled_time);
    if (filter === 'upcoming') return isFuture(date);
    if (filter === 'past') return isPast(date);
    return true;
  });

  const upcomingCount = interviews.filter(i => isFuture(new Date(i.scheduled_time))).length;
  const todayCount = interviews.filter(i => isToday(new Date(i.scheduled_time))).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">Manage and conduct video interviews</p>
        </div>
        {todayCount > 0 && (
          <div className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-2">
            <p className="text-orange-800 font-semibold">
              🔔 {todayCount} interview{todayCount > 1 ? 's' : ''} scheduled today
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{interviews.length}</p>
            </div>
            <Calendar className="text-primary" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-green-600">{upcomingCount}</p>
            </div>
            <Clock className="text-green-500" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-3xl font-bold text-orange-600">{todayCount}</p>
            </div>
            <Video className="text-orange-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({interviews.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({upcomingCount})
        </Button>
        <Button
          variant={filter === 'past' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('past')}
        >
          Past ({interviews.length - upcomingCount})
        </Button>
      </div>

      {/* Interview List */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No interviews scheduled</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Start scheduling interviews from the Candidates page'
                : `No ${filter} interviews`}
            </p>
            {filter === 'all' && (
              <Button variant="primary" onClick={() => navigate('/candidates')}>
                View Candidates
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard 
              key={interview.id} 
              interview={interview}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InterviewCard = ({ interview, navigate }) => {
  const scheduledDate = new Date(interview.scheduled_time);
  const isPastInterview = isPast(scheduledDate);
  const isTodayInterview = isToday(scheduledDate);

  return (
    <Card hoverable>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Candidate & Job Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{interview.candidate_name}</h3>
                {isTodayInterview && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                    TODAY
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-1">
                <Briefcase size={16} className="mr-2" />
                <span className="font-semibold">{interview.job_title}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-2" />
                <span>{interview.job_location}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Mail size={14} className="mr-1" />
              <a href={`mailto:${interview.candidate_email}`} className="hover:text-primary">
                {interview.candidate_email}
              </a>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={14} className="mr-1" />
              <span>{interview.candidate_phone}</span>
            </div>
          </div>
        </div>

        {/* Right: Schedule & Actions */}
        <div className="md:text-right space-y-3">
          {/* Date & Time */}
          <div className="space-y-1">
            <div className="flex items-center md:justify-end text-gray-700">
              <Calendar size={18} className="mr-2" />
              <span className="font-semibold">
                {format(scheduledDate, 'EEEE, MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center md:justify-end text-gray-600">
              <Clock size={18} className="mr-2" />
              <span>{format(scheduledDate, 'h:mm a')}</span>
              <span className="ml-2 text-sm text-gray-500">({interview.duration_minutes} min)</span>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex md:flex-col items-center md:items-end gap-2">
            {isPastInterview ? (
              <span className="badge-gray">Completed</span>
            ) : (
              <>
                <span className={isTodayInterview ? 'badge-warning' : 'badge-success'}>
                  {isTodayInterview ? 'Today' : 'Upcoming'}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/interviews/room/${interview.id}`)}
                  className="whitespace-nowrap"
                >
                  <Video size={16} className="mr-1" />
                  Join Interview
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Match Score */}
      {interview.match_score && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">AI Match Score:</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    interview.match_score >= 80 ? 'bg-green-500' :
                    interview.match_score >= 60 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${interview.match_score}%` }}
                />
              </div>
              <span className="font-bold text-gray-900">{interview.match_score}%</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// Mock data for demo
const mockInterviews = [
  {
    id: 1,
    candidate_name: 'Carlos Rodriguez',
    candidate_email: 'carlos.r@email.com',
    candidate_phone: '(512) 555-0123',
    job_title: 'Construction Foreman',
    job_location: 'Austin, TX',
    scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration_minutes: 30,
    match_score: 92,
    status: 'scheduled'
  },
  {
    id: 2,
    candidate_name: 'Maria Garcia',
    candidate_email: 'maria.garcia@email.com',
    candidate_phone: '(512) 555-0456',
    job_title: 'Electrician',
    job_location: 'San Antonio, TX',
    scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration_minutes: 45,
    match_score: 85,
    status: 'scheduled'
  },
  {
    id: 3,
    candidate_name: 'Juan Hernandez',
    candidate_email: 'juan.h@email.com',
    candidate_phone: '(512) 555-0789',
    job_title: 'Plumber',
    job_location: 'Houston, TX',
    scheduled_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    duration_minutes: 30,
    match_score: 78,
    status: 'completed'
  },
  {
    id: 4,
    candidate_name: 'Ana Martinez',
    candidate_email: 'ana.martinez@email.com',
    candidate_phone: '(512) 555-0321',
    job_title: 'Carpenter',
    job_location: 'Dallas, TX',
    scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    duration_minutes: 60,
    match_score: 88,
    status: 'scheduled'
  },
];

export default InterviewsPage;
