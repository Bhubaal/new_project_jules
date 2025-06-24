import React from 'react';
import Dashboard from './Dashboard';
import Login from './Login'; // Import the Login component
import './App.css';
import DashboardLayout from './DashboardLayout';

// Basic ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <DashboardLayout title="Leave-O-Meter">
      <Dashboard />
    </DashboardLayout>

  );
}

export default App;
