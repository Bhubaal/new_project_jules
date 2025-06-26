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
import AdminLeaveWFHManagementPage from '../pages/AdminLeaveWFHManagementPage'; // Import the new admin page

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperuser?: boolean;
}

const ProtectedRoute = ({ children, requireSuperuser = false }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperuser && !isSuperuser) {
    // Optionally, redirect to a 'Not Authorized' page or back to home
    // For now, redirecting to home, or you could show a message.
    alert('You are not authorized to view this page.'); // Simple alert for now
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
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
        <Route path="/admin/manage-records" element={
          <ProtectedRoute requireSuperuser={true}>
            <DashboardLayout>
              <AdminLeaveWFHManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
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
