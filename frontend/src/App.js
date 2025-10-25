import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import JobPosting from "./pages/JobPosting";
import ActiveJobs from "./pages/ActiveJobs";
import CandidatePortal from "./pages/CandidatePortal";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewsPage from "./pages/InterviewsPage";

// Components
import CandidateList from "./components/hiring/CandidateList";
import InterviewScheduler from "./components/hiring/InterviewScheduler";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Landing Page - No Navbar/Sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Candidate Routes - With Navbar only (NO Sidebar) */}
        <Route
          path="/apply/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <main className="p-6 md:p-8">
                <Routes>
                  <Route path="/" element={<CandidatePortal />} />
                  <Route 
                    path="/success" 
                    element={
                      <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="bg-white rounded-lg shadow-md p-12">
                          <div className="text-green-500 mb-6">
                            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
                          <p className="text-lg text-gray-600 mb-8">
                            Thank you for your application. We will review your profile and get back to you soon.
                          </p>
                          <button
                            onClick={() => window.location.href = '/apply'}
                            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            View More Jobs
                          </button>
                        </div>
                      </div>
                    } 
                  />
                  <Route path="/:jobId" element={<CandidatePortal />} />
                </Routes>
              </main>
            </div>
          }
        />

        {/* Hiring Manager Routes - With Navbar & Sidebar */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

              <div className="flex">
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />

                <main className="flex-1 p-6 md:p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/jobs" element={<ActiveJobs />} />
                    <Route path="/jobs/new" element={<JobPosting />} />
                    <Route path="/jobs/:jobId" element={<JobPosting />} />
                    <Route
                      path="/applications"
                      element={
                        <div>
                          <h1 className="text-3xl font-bold mb-6">
                            All Applications
                          </h1>
                          <CandidateList />
                        </div>
                      }
                    />
                    <Route
                      path="/applications/:applicationId"
                      element={
                        <div>
                          <h1 className="text-3xl font-bold mb-6">
                            Application Details
                          </h1>
                          <CandidateList />
                        </div>
                      }
                    />
                    <Route
                      path="/candidates"
                      element={
                        <div>
                          <h1 className="text-3xl font-bold mb-6">
                            All Candidates
                          </h1>
                          <CandidateList />
                        </div>
                      }
                    />
                    <Route path="/interviews" element={<InterviewsPage />} />
                    <Route
                      path="/interviews/schedule/:applicationId"
                      element={<InterviewScheduler />}
                    />
                    <Route
                      path="/interviews/room/:interviewId"
                      element={<InterviewRoom />}
                    />

                    {/* 404 */}
                    <Route
                      path="*"
                      element={
                        <div className="text-center py-20">
                          <h1 className="text-6xl font-bold text-gray-300 mb-4">
                            404
                          </h1>
                          <p className="text-xl text-gray-600">
                            Page not found
                          </p>
                        </div>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
