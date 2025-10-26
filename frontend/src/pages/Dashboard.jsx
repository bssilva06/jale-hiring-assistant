import React, { useState, useEffect } from 'react';
import { jobsAPI, interviewsAPI, applicationsAPI } from '../services/api';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import CandidateList from '../components/hiring/CandidateList';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Clock,
  UserCheck 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hired: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs
      const jobsRes = await jobsAPI.getAll();
      const jobs = jobsRes.data || [];

      // Fetch applications
      let applications = [];
      try {
        const applicationsRes = await applicationsAPI.getAll();
        applications = applicationsRes.data || [];
      } catch (appError) {
        console.warn('Applications table error:', appError.message);
      }

      // Fetch interviews
      let interviews = [];
      try {
        const interviewsRes = await interviewsAPI.getAll();
        interviews = interviewsRes.data || [];
      } catch (interviewError) {
        console.warn('Interviews table not ready yet:', interviewError.message);
      }

      console.log('Dashboard API Response:', {
        jobs,
        applications,
        interviews
      });

      // Calculate stats
      const totalApplications = applications.length;
      const hiredCount = applications.filter(app => app.status === 'hired').length;
      const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;

      setStats({
        totalJobs: jobs.length,
        totalApplications,
        interviewsScheduled: scheduledInterviews,
        hired: hiredCount,
      });

      setRecentJobs(jobs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response || error.message);
      // Set empty state on error
      setStats({
        totalJobs: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        hired: 0,
      });
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <Card hoverable onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your recruitment process with AI assistance</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/jobs/new')}
        >
          <Briefcase size={20} className="inline mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.totalJobs}
          color="bg-blue-500"
          onClick={() => navigate('/jobs')}
        />
        <StatCard
          icon={Users}
          label="Total Applications"
          value={stats.totalApplications}
          color="bg-green-500"
          onClick={() => navigate('/candidates')}
        />
        <StatCard
          icon={Calendar}
          label="Interviews Scheduled"
          value={stats.interviewsScheduled}
          color="bg-purple-500"
          onClick={() => navigate('/interviews')}
        />
        <StatCard
          icon={UserCheck}
          label="Hired"
          value={stats.hired}
          color="bg-emerald-500"
        />
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/candidates')}
              >
                View All
              </Button>
            </div>
            <CandidateList />
          </Card>
        </div>

        <div className="space-y-6">
          {/* Active Jobs */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Jobs</h2>
            {recentJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase size={48} className="mx-auto mb-3 opacity-50" />
                <p>No active jobs</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/jobs/new')}
                >
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      ${job.pay}/hr • {job.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {job.application_count || 0} applications
                      </span>
                      <span className="badge-blue text-xs">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/jobs/new')}
              >
                <Briefcase size={18} className="mr-2" />
                Post New Job
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/candidates')}
              >
                <Users size={18} className="mr-2" />
                View Candidates
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/interviews')}
              >
                <Calendar size={18} className="mr-2" />
                Manage Interviews
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
