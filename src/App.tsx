import React from 'react';
import Dashboard from './Dashboard';
import './App.css';
import DashboardLayout from './DashboardLayout';

function App() {
  return (
    <DashboardLayout title="Leave-O-Meter">
      <Dashboard />
    </DashboardLayout>
  );
}

export default App;
