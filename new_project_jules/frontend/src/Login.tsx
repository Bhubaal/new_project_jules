import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

// Define the type for form values
interface LoginValues {
  username: string;
  password: string;
}

// Define the type for the decoded token
interface DecodedToken {
  sub: string;
  permissions: string;
  exp: number;
  // Add other claims if present in your token
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues, { setSubmitting, setFieldError }: FormikHelpers<LoginValues>) => {
    setSubmitting(true);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('is_superuser');

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
        return; // Exit if token request fails
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        setFieldError('username', 'Login failed: No access token received.');
        return;
      }
      localStorage.setItem('accessToken', accessToken);

      // Step 2: Decode the token to get user permissions
      try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken);
        const permissions = decodedToken.permissions;
        const isSuperuser = permissions === 'admin';

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('is_superuser', String(isSuperuser));

        navigate('/'); // Navigate to home page
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        setFieldError('username', 'Login successful, but failed to process user information.');
        // Clear stored items if token decoding fails, as we can't trust the session
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('is_superuser');
      }

    } catch (error) {
      console.error('Login process error:', error);
      // Check if error is an instance of Error to safely access message property
      let errorMessage = 'An unexpected error occurred during login. Please try again.';
      if (error instanceof Error) {
        // Potentially more specific error handling based on error.name or error.message
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to the server. Please check your network connection.';
        }
      }
      setFieldError('username', errorMessage);
      // Ensure localStorage is cleaned up on error regardless of where it occurs in try block
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('is_superuser');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
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
          {({ isSubmitting }) => ( // isSubmitting type is inferred by Formik
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
                error={!!(<ErrorMessage name="username" />)}
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
                error={!!(<ErrorMessage name="password" />)}
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
              <Grid container justifyContent="space-between">
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
