import Dashboard from './Dashboard';
// import Login from './Login'; // Import the Login component - Unused for now
import './App.css';
import DashboardLayout from './DashboardLayout';
// import { Navigate } from 'react-router-dom'; // Navigate was unused

// Basic ProtectedRoute component (Currently unused, will be removed by linting if not used)
// Ensure JSX.Element is recognized, might need to ensure tsconfig.app.json has "jsx": "react-jsx" (which it does)
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => { // Changed to React.ReactNode for broader compatibility
//   const isAuthenticated = localStorage.getItem('isAuthenticated');
//   if (!isAuthenticated) {
//     // Navigate component should be used within a Routes context or have a navigator from context
//     // For simplicity here, we'll assume this will be part of a <Routes> setup
//     return <Navigate to="/login" replace />;
//   }
//   return <>{children}</>; // Use fragment if children is ReactNode
// };

function App() {
  // For now, directly rendering Dashboard within DashboardLayout.
  // Routing setup would typically go here if Login and other pages were actively used.
  // Example of how routing could be structured:
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/" element={
  //         <ProtectedRoute>
  //           <DashboardLayout title="Leave-O-Meter">
  //             <Dashboard />
  //           </DashboardLayout>
  //         </ProtectedRoute>
  //       } />
  //       {/* Add other routes here */}
  //     </Routes>
  //   </Router>
  // );

  // Current simplified setup:
  return (
    <DashboardLayout title="Leave-O-Meter">
      <Dashboard />
    </DashboardLayout>
  );
}

export default App;
