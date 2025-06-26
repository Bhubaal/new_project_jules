import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'; // Import FormikHelpers
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Define the type for form values
interface LoginValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues, { setSubmitting, setFieldError }: FormikHelpers<LoginValues>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', values.email); // Assuming email is used as username
      formData.append('password', values.password);

      const response = await fetch('http://localhost:8888/api/token', { // Assuming backend runs on port 8888
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access_token);
        navigate('/');
      } else {
        const errorData = await response.json();
        setFieldError('email', errorData.detail || 'Login failed'); // Show error message
        localStorage.removeItem('accessToken'); // Clear any old token
      }
    } catch (error) {
      console.error('Login error:', error);
      setFieldError('email', 'An unexpected error occurred. Please try again.');
      localStorage.removeItem('accessToken'); // Clear any old token
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
          initialValues={{ email: '', password: '' }}
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                helperText={<ErrorMessage name="email" />}
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
              <Grid container justifyContent="space-between"> {/* Added justifyContent */}
                <Grid item xs> {/* Takes available space */}
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item> {/* Takes content width */}
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
