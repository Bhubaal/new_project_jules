import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'; // Import FormikHelpers
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Define the type for form values
interface LoginValues {
  username: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues, { setSubmitting, setFieldError }: FormikHelpers<LoginValues>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('password', values.password);

      // Step 1: Get the access token
      const tokenResponse = await fetch('http://localhost:8000/api/token', { // Token endpoint
        method: 'POST',
        body: formData,
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        setFieldError('username', errorData.detail || 'Login failed: Invalid credentials');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('is_superuser');
        return; // Exit if token request fails
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      localStorage.setItem('accessToken', accessToken);

      // Step 2: Fetch user details using the token
      const userDetailsResponse = await fetch('http://localhost:8000/api/v1/users/me', { // Main API endpoint
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!userDetailsResponse.ok) {
        const errorData = await userDetailsResponse.json();
        console.error('Failed to fetch user details:', errorData.detail);
        // Even if user details fail, token might be valid but further action might be needed.
        // For now, let's treat this as a partial success but flag that user details couldn't be fetched.
        // Or, treat as a full failure for security/consistency.
        setFieldError('username', 'Login successful, but failed to fetch user details.');
        // Decide if we should clear the token or allow login with partial data.
        // For now, clearing stored items for safety if user details are crucial.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('is_superuser');
        return;
      }

      const userData = await userDetailsResponse.json();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('is_superuser', String(userData.is_superuser)); // Store as string 'true' or 'false'

      navigate('/'); // Navigate to home page

    } catch (error) {
      console.error('Login process error:', error);
      setFieldError('username', 'An unexpected error occurred during login. Please try again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('is_superuser');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box // Use Box for full-page background
      sx={{
        minHeight: '100vh', // Ensure it covers the full viewport height
        display: 'flex',
        alignItems: 'center', // Center content vertically
        justifyContent: 'center', // Center content horizontally
        bgcolor: '#E3F2FD', // Placeholder background color (muted blue)
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            padding: 4, // Add some padding
            backgroundColor: 'white', // White background for the form card
            borderRadius: 2, // Rounded corners for the card
            boxShadow: 3, // Add a subtle shadow
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }: { isSubmitting: boolean }) => ( // Explicitly type isSubmitting
            <Form>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username or Email"
                name="username"
                autoComplete="username"
                autoFocus
                helperText={<ErrorMessage name="username" />}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={<ErrorMessage name="password" />}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
