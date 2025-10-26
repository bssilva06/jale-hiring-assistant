import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { Briefcase, MapPin, DollarSign, Clock, Award, Search, TrendingUp, Upload, Loader } from 'lucide-react';

const JobMatcher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    // Job Preferences
    jobType: '',
    schedule: '',
    minPay: '',
    maxPay: '',
    location: '',
    preferredField: '',
    
    // Candidate Info
    name: '',
    email: '',
    phone: '',
    experience_years: '',
    skills: '',
    certifications: '',
    education: '',
    language_preference: 'en',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Please upload a PDF or TXT file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setParsingResume(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);
      
      const response = await fetch('http://localhost:5000/api/candidates/parse-resume-file', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const parsedData = await response.json();
      console.log('Parsed resume data:', parsedData);

      setFormData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        skills: parsedData.skills?.join(', ') || prev.skills,
        experience_years: parsedData.experience_years?.toString() || prev.experience_years,
        certifications: parsedData.certifications?.join(', ') || prev.certifications,
        education: parsedData.education || prev.education,
      }));

      alert('✅ Resume parsed successfully! Please review the auto-filled information.');
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('❌ ' + error.message);
    } finally {
      setParsingResume(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch all active jobs
      const response = await jobsAPI.getAll();
      const activeJobs = response.data.filter(job => job.status === 'active');

      // Parse skills
      const candidateSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      // Match jobs based on criteria
      // SCORING BREAKDOWN (Total: 120 points, capped at 100%):
      // - Schedule: 30 points (Full-time, Part-time, etc.)
      // - Skills: 30 points (5 points per matching skill, up to 6 skills)
      // - Pay: 25 points (15 if exceeds minimum only)
      // - Location: 20 points
      // - Field: 15 points
      const matches = activeJobs.map(job => {
        let score = 0;
        const reasons = [];

        // Schedule match (30 points) - HIGH PRIORITY
        // Check both job_type (Full-time/Part-time) and schedule fields
        if (formData.schedule) {
          const candidateSchedule = formData.schedule.toLowerCase().trim();
          
          // Check job_type field first (Full-time, Part-time, etc.)
          if (job.job_type) {
            const jobType = job.job_type.toLowerCase().trim();
            if (jobType === candidateSchedule || 
                jobType.includes(candidateSchedule) || 
                candidateSchedule.includes(jobType)) {
              score += 30;
              reasons.push(`✓ Job Type: ${job.job_type} matches your ${formData.schedule} preference`);
              console.log(`✓ Job Type match for ${job.title}: "${job.job_type}" matches "${formData.schedule}"`);
            }
          }
          // Also check schedule field for backward compatibility
          else if (job.schedule) {
            const jobSchedule = job.schedule.toLowerCase().trim();
            if (jobSchedule === candidateSchedule || 
                jobSchedule.includes(candidateSchedule) || 
                candidateSchedule.includes(jobSchedule)) {
              score += 30;
              reasons.push(`✓ Schedule: ${job.schedule} matches your ${formData.schedule} preference`);
              console.log(`✓ Schedule match for ${job.title}: "${job.schedule}" matches "${formData.schedule}"`);
            } else {
              console.log(`✗ Schedule NO match for ${job.title}: "${job.schedule}" vs "${formData.schedule}"`);
            }
          }
        }

        // Pay match (25 points)
        if (formData.minPay && formData.maxPay && job.pay) {
          const minPay = parseFloat(formData.minPay);
          const maxPay = parseFloat(formData.maxPay);
          const jobPay = parseFloat(job.pay);
          
          if (jobPay >= minPay && jobPay <= maxPay) {
            score += 25;
            reasons.push(`✓ Pay: $${job.pay}/hr is within your $${minPay}-$${maxPay} range`);
          } else if (jobPay >= minPay) {
            score += 15;
            reasons.push(`✓ Pay: $${job.pay}/hr exceeds your minimum of $${minPay}`);
          }
        }

        // Location match (20 points)
        if (formData.location && job.location) {
          if (job.location.toLowerCase().includes(formData.location.toLowerCase())) {
            score += 20;
            reasons.push(`✓ Location: ${job.location} matches your preference`);
          }
        }

        // Field/Title match (15 points)
        if (formData.preferredField && job.title) {
          if (job.title.toLowerCase().includes(formData.preferredField.toLowerCase()) ||
              job.description?.toLowerCase().includes(formData.preferredField.toLowerCase())) {
            score += 15;
            reasons.push(`✓ Field: Matches your preferred field (${formData.preferredField})`);
          }
        }

        // Skills match (30 points)
        if (candidateSkills.length > 0) {
          // Extract skills from job description and requirements text
          const jobText = `${job.description || ''} ${job.requirements || ''}`.toLowerCase();
          
          const matchingSkills = candidateSkills.filter(skill => 
            jobText.includes(skill.toLowerCase())
          );
          
          if (matchingSkills.length > 0) {
            // Give more points for more matching skills
            const skillPoints = Math.min(matchingSkills.length * 5, 30); // Up to 30 points for skills
            score += skillPoints;
            reasons.push(`✓ Skills: ${matchingSkills.length} match (${matchingSkills.join(', ')})`);
          }
        }

        return {
          ...job,
          matchScore: Math.min(score, 100),
          matchReasons: reasons,
        };
      });

      // Sort by match score
      const sortedMatches = matches
        .filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedJobs(sortedMatches);
      setShowResults(true);
    } catch (error) {
      console.error('Error matching jobs:', error);
      alert('Failed to find matching jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`, { 
      state: { 
        prefillData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience_years: formData.experience_years,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
          education: formData.education,
          language_preference: formData.language_preference,
        }
      }
    });
  };

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Matched Jobs for You</h1>
            <p className="text-gray-600 mt-1">
              Found {matchedJobs.length} job{matchedJobs.length !== 1 ? 's' : ''} matching your preferences
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowResults(false)}>
            New Search
          </Button>
        </div>

        {/* Results */}
        {matchedJobs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Perfect Matches Yet</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your preferences or check back later for new opportunities
              </p>
              <Button variant="primary" onClick={() => setShowResults(false)}>
                Refine Search
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {matchedJobs.map((job) => (
              <Card key={job.id} hoverable>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      {/* Match Score Badge */}
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        job.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                        job.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {job.matchScore}% Match
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-1" />
                        ${job.pay}/hr
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1" />
                        {job.schedule}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase size={16} className="mr-1" />
                        {job.job_type}
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {job.matchReasons.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center">
                          <TrendingUp size={14} className="mr-1" />
                          Why this is a great match:
                        </p>
                        <ul className="space-y-1">
                          {job.matchReasons.slice(0, 3).map((reason, idx) => (
                            <li key={idx} className="text-xs text-blue-800 flex items-start">
                              <span className="mr-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                  </div>

                  {/* Right: Action */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleApply(job.id)}
                      className="whitespace-nowrap"
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/apply/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Search className="mr-3" size={32} />
            Find Your Ideal Job
          </h1>
          <p className="text-gray-600">
            Tell us what you're looking for and we'll match you with the best opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto text-purple-500 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your Resume (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Let AI auto-fill your information from your resume!
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
                  <div className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center space-x-2">
                    {parsingResume ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Parsing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Upload Resume</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                PDF or TXT • Max 5MB • Or fill manually below
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  min="0"
                  className="input-field"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Preferred Schedule
                </label>
                <select
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Night Shift">Night Shift</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Preferred Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Austin, TX or Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Minimum Pay ($/hour)
                </label>
                <input
                  type="number"
                  name="minPay"
                  value={formData.minPay}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="15.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Maximum Pay ($/hour)
                </label>
                <input
                  type="number"
                  name="maxPay"
                  value={formData.maxPay}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="25.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-1" />
                  Preferred Field/Industry
                </label>
                <input
                  type="text"
                  name="preferredField"
                  value={formData.preferredField}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Construction, Warehouse, Customer Service"
                />
              </div>
            </div>
          </div>

          {/* Skills & Qualifications */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Qualifications</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award size={16} className="inline mr-1" />
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Forklift, Bilingual, Customer Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., OSHA, First Aid, CDL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Some College">Some College</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Finding Matches...' : 'Find Matching Jobs'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/apply')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JobMatcher;
