
// src/pages/UserProfilePage.tsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import useUserProfile from "../../hooks/useUserProfile";
import axios from 'axios';

const UserProfilePage: React.FC = () => {
  const { userProfile, loading, error } = useUserProfile();
  const [formValues, setFormValues] = useState<UserProfile | null>(userProfile);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token || !formValues) return;

      await axios.put('/api/user/profile', formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage('Profile updated successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile');
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {formValues && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Gender"
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Profile Image URL"
            name="profileImage"
            value={formValues.profileImage}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfilePage;

