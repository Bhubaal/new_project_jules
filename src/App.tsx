import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login'; // Import the Login component
import './App.css';
import { Container, Typography } from '@mui/material';

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
    <>
      <Typography variant="h3" component="h1" gutterBottom style={{ textAlign: 'center', margin: '20px 0' }}>
        Leave-O-Meter
      </Typography>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
