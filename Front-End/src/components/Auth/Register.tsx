
import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Person } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Grow, Paper, Avatar, Typography, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from '@mui/material';

// Define the validation schema with Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'), confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  gender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits')
    .optional()
});

const Register: React.FC = () => {
const navigate=useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'MALE',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

  const paperStyle = {
    padding: '30px 20px',
    width: '30%',
    margin: "20px auto"
  };
  const avatarStyle = { backgroundColor: '#00712D' };
  const marginTop = { marginTop: 5 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors before validation/submission
    setErrors({});

    try {
        // Validate the form using Yup
        await validationSchema.validate(values, { abortEarly: false });

        // Form is valid; handle form submission here
        const response = await axios.post('http://localhost:3000/api/auth/register', values);
        console.log('Form submitted:', values);
        navigate('/login');
    } catch (err: any) {
        // If Yup validation error occurs
        if (err.name === 'ValidationError') {
            const validationErrors = err.inner.reduce((acc: any, error: any) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(validationErrors);
        } else if (err.response && err.response.data) {
            // Handle server-side errors (like duplicate email, username, or phone number)
            if (err.response.data.errors) {
                // If multiple errors are returned
                const errorMessages = err.response.data.errors.reduce((acc: any, error: any) => {
                    acc[error.field] = error.message;
                    return acc;
                }, {});
                setErrors(errorMessages);
            } else {
                // Handle general server-side errors
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } else {
            // Handle unexpected errors
            setErrors({ general: 'An unexpected error occurred. Please try again later.' });
        }
    }
};
return (
    <Grid>
      <Grow in={true}>
        <Paper elevation={5} style={paperStyle}>
      <Grid container justifyContent="center" flexDirection="column"alignItems="center">
            <Avatar style={avatarStyle}>
              <Person />
            </Avatar>
            <Typography variant='h5'>
              Sign Up
            </Typography>
            <Typography variant='caption' gutterBottom>
              Please fill this form to create an account!
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                name="username"
                label="Username"
                placeholder="Create your Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.username && errors.username}
                error={Boolean(touched.username && errors.username)}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
                fullWidth
              />
            </FormControl>

            <FormControl component="fieldset" style={marginTop} fullWidth>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ display: 'initial' }}
              >
                <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
              </RadioGroup>
              <Typography variant='body2' style={{ color: 'red' }}>
                {touched.gender && errors.gender}
              </Typography>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.phoneNumber && errors.phoneNumber}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.confirmPassword && errors.confirmPassword}
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                fullWidth
              />
            </FormControl>

            <Button type='submit'  variant='contained' color='primary' fullWidth style={marginTop}>
            
              Sign up
            </Button>

            <Typography variant='subtitle2' sx={{ color: 'gray', margin: 1 }}>
              Already a User? <Link to="/login" style={{ textDecoration: 'none' }}>Log In</Link>
            </Typography>
          </form>
        </Paper>
      </Grow>
    </Grid>
  );
};

export default Register;

