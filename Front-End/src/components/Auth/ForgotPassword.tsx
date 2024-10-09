
import React, { useState } from 'react';
import { Grid,Grow, Paper, Avatar, TextField, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false); // State to track if it's an error

  const [checked] = useState(true);
  const paperStyle = { padding: 20, height: '40vh', width: '30%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#00712D' };
  const btnstyle = { margin: '8px 0' };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setMessage('Password reset link sent. Please check your email.');
      setIsError(false); // Reset error state
    } catch (err) {
      setMessage('Error sending password reset link. Please try again.');
      setIsError(true); // Set error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="center">

        <Grow in={checked}>
        <Paper elevation={10} style={paperStyle}>
      <Grid container justifyContent="center" flexDirection="column"alignItems="center">
            <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
            <Typography variant="h5">Forgot Password</Typography>
          </Grid>
          <TextField
            label="Email"
            value={email}
            placeholder="Enter Email"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && (
            <Typography
              style={{ margin: '10px 0', color: isError ? 'red' : 'green' }} // Change color based on isError
            >
              {message}
            </Typography>
          )}
          <Button type="submit" color="primary" variant="contained" style={btnstyle} fullWidth>
            Send Reset Link
          </Button>
        </Paper>
        </Grow>
      </Grid>
    </form>
  );
};

export default ForgotPassword;

