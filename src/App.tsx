import Dashboard from './Dashboard';
import './App.css';
import { Container, Typography } from '@mui/material';

function App() {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom style={{ textAlign: 'center', margin: '20px 0' }}>
        Leave-O-Meter
      </Typography>
      <Dashboard />
    </Container>
  );
}

export default App;
