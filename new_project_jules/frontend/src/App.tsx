import JinzaiDashboard from './JinzaiDashboard';
import Login from './Login'; // Import the Login component
import './App.css';
import DashboardLayout from './DashboardLayout';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import IVForumPage from '../pages/iv-forum';
import WorkFromHomePage from '../pages/work-from-home';
import LeaveRequestsPage from '../pages/LeaveRequestsPage';
import WorkFromHomeRequestsPage from '../pages/WorkFromHomeRequestsPage';
import AttendancePage from '../pages/attendance';
import AdminLeaveWFHManagementPage from '../pages/AdminLeaveWFHManagementPage';
// Note: LeavesPage is imported but not used in any route. If it's needed, a route should be added.
// import LeavesPage from '../pages/LeavesPage';

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
    alert('You are not authorized to view this page.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Helper component to wrap routes with DashboardLayout and ProtectedRoute
interface AppRouteProps {
  element: React.ReactElement;
  requireSuperuser?: boolean;
}

const AppRoute = ({ element, requireSuperuser = false }: AppRouteProps) => (
  <ProtectedRoute requireSuperuser={requireSuperuser}>
    <DashboardLayout>
      {element}
    </DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<AppRoute element={<JinzaiDashboard />} />} />
        <Route path="/iv-forum" element={<AppRoute element={<IVForumPage />} />} />
        <Route path="/work-from-home" element={<AppRoute element={<WorkFromHomePage />} />} />
        <Route path="/attendance" element={<AppRoute element={<AttendancePage />} />} />
        <Route path="/leaves/request" element={<AppRoute element={<LeaveRequestsPage />} />} />
        <Route path="/work-from-home/requests" element={<AppRoute element={<WorkFromHomeRequestsPage />} />} />

        {/* Superuser-only protected route */}
        <Route
          path="/admin/manage-records"
          element={<AppRoute element={<AdminLeaveWFHManagementPage />} requireSuperuser={true} />}
        />

        {/* Fallback for any other route - can redirect to home or a 404 page */}
        {/* For now, redirecting to home if authenticated, or login if not. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
