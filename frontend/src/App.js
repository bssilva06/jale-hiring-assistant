import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import JobPosting from './pages/JobPosting';
import CandidatePortal from './pages/CandidatePortal';
import InterviewRoom from './pages/InterviewRoom';

// Components
import CandidateList from './components/hiring/CandidateList';
import InterviewScheduler from './components/hiring/InterviewScheduler';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Landing Page - No Navbar/Sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Candidate Routes - With Navbar only (NO Sidebar) */}
        <Route path="/apply/*" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="p-6 md:p-8">
              <Routes>
                <Route path="/" element={<CandidatePortal />} />
                <Route path="/:jobId" element={<CandidatePortal />} />
              </Routes>
            </main>
          </div>
        } />

        {/* Hiring Manager Routes - With Navbar & Sidebar */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            
            <div className="flex">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <main className="flex-1 p-6 md:p-8">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs/new" element={<JobPosting />} />
                  <Route path="/candidates" element={<div><h1 className="text-3xl font-bold mb-6">All Candidates</h1><CandidateList /></div>} />
                  <Route path="/interviews" element={<div><h1 className="text-3xl font-bold mb-6">Interviews</h1><p className="text-gray-600">Interview list coming soon...</p></div>} />
                  <Route path="/interviews/schedule/:applicationId" element={<InterviewScheduler />} />
                  <Route path="/interviews/room/:interviewId" element={<InterviewRoom />} />
                  
                  {/* 404 */}
                  <Route path="*" element={
                    <div className="text-center py-20">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                      <p className="text-xl text-gray-600">Page not found</p>
                    </div>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
