import JinzaiDashboard from './JinzaiDashboard';
import Login from './Login'; // Import the Login component
import './App.css';
import DashboardLayout from './DashboardLayout';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the new page components
import IVForumPage from '../pages/iv-forum';
import WorkFromHomePage from '../pages/work-from-home';
// import LeavePage from '../pages/leave'; // Old leave page
import LeavesPage from '../pages/LeavesPage'; // New leaves page
import LeaveRequestsPage from '../pages/LeaveRequestsPage'; // New Leave Requests page
import WorkFromHomeRequestsPage from '../pages/WorkFromHomeRequestsPage'; // New WFH Requests page
import AttendancePage from '../pages/attendance';

// Basic ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    // Navigate component should be used within a Routes context or have a navigator from context
    // For simplicity here, we'll assume this will be part of a <Routes> setup
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>; // Use fragment if children is ReactNode
};

function App() {
  // For now, directly rendering Dashboard within DashboardLayout.
  // Routing setup would typically go here if Login and other pages were actively used.
  // Example of how routing could be structured:
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <JinzaiDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/iv-forum" element={
          <ProtectedRoute>
            <DashboardLayout>
              <IVForumPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/work-from-home" element={
          <ProtectedRoute>
            <DashboardLayout>
              <WorkFromHomePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        {/* <Route path="/leave" element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeavePage />
            </DashboardLayout>
          </ProtectedRoute>
        } /> */}
        <Route path="/attendance" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AttendancePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/leaves/request" element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeaveRequestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/work-from-home/requests" element={
          <ProtectedRoute>
            <DashboardLayout>
              <WorkFromHomeRequestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );

  // Current simplified setup:
  // The `title` prop for DashboardLayout is removed as the title is now set within DashboardLayout's AppBar.
  // return (
  //   <DashboardLayout>
  //     <JinzaiDashboard />
  //   </DashboardLayout>
  // );
}

export default App;
