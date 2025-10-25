import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { getMatchScoreColor, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import { User, Mail, Phone, Award, Calendar } from 'lucide-react';

const CandidateList = ({ jobId = null }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const response = jobId 
        ? await applicationsAPI.getByJobId(jobId)
        : await applicationsAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Use mock data for demo
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'high') return app.match_score >= 80;
    if (filter === 'medium') return app.match_score >= 60 && app.match_score < 80;
    if (filter === 'low') return app.match_score < 60;
    return app.status === filter;
  });

  const MatchScoreBadge = ({ score }) => {
    const color = getMatchScoreColor(score);
    const colorClasses = {
      green: 'badge-green',
      yellow: 'badge-yellow',
      red: 'badge-red',
    };

    return (
      <span className={colorClasses[color]}>
        {score}% Match
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const color = STATUS_COLORS[status] || 'gray';
    const colorClasses = {
      blue: 'badge-blue',
      yellow: 'badge-yellow',
      purple: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold',
      indigo: 'bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold',
      green: 'badge-green',
      red: 'badge-red',
    };

    return (
      <span className={colorClasses[color]}>
        {STATUS_LABELS[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'high' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Excellent (80%+)
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'medium' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Good (60-79%)
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'low' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Poor (&lt;60%)
        </button>
      </div>

      {/* Candidate Cards */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No candidates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <Card 
              key={application.id} 
              hoverable
              onClick={() => navigate(`/applications/${application.id}`)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {application.candidate?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {application.candidate?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.job?.title || 'Position'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="flex items-center justify-between">
                  <MatchScoreBadge score={application.match_score} />
                  <StatusBadge status={application.status} />
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span className="truncate">{application.candidate?.email}</span>
                  </div>
                  {application.candidate?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>{application.candidate?.phone}</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {application.candidate?.skills && (
                  <div className="flex flex-wrap gap-2">
                    {application.candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.candidate.skills.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{application.candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Strengths */}
                {application.strengths && application.strengths.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      <Award size={12} className="inline mr-1" />
                      Top Strength:
                    </p>
                    <p className="text-xs text-gray-600">{application.strengths[0]}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/interviews/schedule/${application.id}`);
                    }}
                  >
                    <Calendar size={16} className="inline mr-1" />
                    Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/applications/${application.id}`);
                    }}
                  >
                    View
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

// Mock data for demo
const mockApplications = [
  {
    id: 1,
    match_score: 92,
    status: 'under_review',
    candidate: {
      name: 'Carlos Rodriguez',
      email: 'carlos.r@email.com',
      phone: '(512) 555-0123',
      skills: ['Welding', 'Blueprint Reading', 'Safety Certification', 'Concrete Work'],
    },
    job: {
      title: 'Construction Foreman',
    },
    strengths: ['10+ years experience in commercial construction', 'OSHA certified'],
  },
  {
    id: 2,
    match_score: 88,
    status: 'interviewing',
    candidate: {
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '(512) 555-0456',
      skills: ['Electrical Wiring', 'Code Compliance', 'Troubleshooting', 'Industrial Systems'],
    },
    job: {
      title: 'Electrician - Commercial',
    },
    strengths: ['Licensed Master Electrician', 'Bilingual (EN/ES)'],
  },
  {
    id: 3,
    match_score: 85,
    status: 'under_review',
    candidate: {
      name: 'Juan Hernandez',
      email: 'juan.h@email.com',
      phone: '(512) 555-0789',
      skills: ['Plumbing', 'Pipefitting', 'Gas Lines', 'Water Heaters'],
    },
    job: {
      title: 'Plumber',
    },
    strengths: ['EPA 608 certified', '8 years residential & commercial experience'],
  },
  {
    id: 4,
    match_score: 78,
    status: 'applied',
    candidate: {
      name: 'Ana Martinez',
      email: 'ana.m@email.com',
      phone: '(512) 555-0321',
      skills: ['Carpentry', 'Framing', 'Finish Work', 'Blueprint Reading'],
    },
    job: {
      title: 'Carpenter - Residential',
    },
    strengths: ['Custom home building specialist', 'Detail-oriented finish work'],
  },
  {
    id: 5,
    match_score: 82,
    status: 'under_review',
    candidate: {
      name: 'Miguel Santos',
      email: 'miguel.s@email.com',
      phone: '(512) 555-0654',
      skills: ['HVAC Installation', 'Refrigeration', 'Ductwork', 'System Diagnostics'],
    },
    job: {
      title: 'HVAC Technician',
    },
    strengths: ['EPA Universal certification', 'Commercial HVAC experience'],
  },
  {
    id: 6,
    match_score: 72,
    status: 'applied',
    candidate: {
      name: 'Luis Ramirez',
      email: 'luis.r@email.com',
      phone: '(512) 555-0987',
      skills: ['Painting', 'Surface Prep', 'Spray Systems', 'Color Matching'],
    },
    job: {
      title: 'Painter',
    },
    strengths: ['Commercial & industrial painting', 'High-volume experience'],
  },
  {
    id: 7,
    match_score: 90,
    status: 'interviewing',
    candidate: {
      name: 'Sofia Lopez',
      email: 'sofia.l@email.com',
      phone: '(512) 555-0246',
      skills: ['Project Management', 'Team Leadership', 'Budgeting', 'Safety Management'],
    },
    job: {
      title: 'Construction Foreman',
    },
    strengths: ['Led teams of 20+ workers', 'Strong safety record'],
  },
  {
    id: 8,
    match_score: 68,
    status: 'applied',
    candidate: {
      name: 'Diego Flores',
      email: 'diego.f@email.com',
      phone: '(512) 555-0135',
      skills: ['Roofing', 'Waterproofing', 'Shingle Installation', 'Flat Roofs'],
    },
    job: {
      title: 'Roofer',
    },
    strengths: ['5 years roofing experience', 'Storm damage specialist'],
  },
];

export default CandidateList;
