
import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get the reset token from the URL
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const paperStyle = { padding: 20, height: '50vh', width: '30%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#00712D' };
  const btnstyle = { margin: '8px 0' };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successfully');
        navigate('/login')
    } catch (err) {
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="center">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
            <Typography variant="h5">Reset Password</Typography>
          </Grid>
          <TextField
            label="New Password"
            value={password}
            placeholder="Enter new password"
            margin="normal"
            type="password"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            placeholder="Confirm your new password"
            margin="normal"
            type="password"
            fullWidth
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message && <Typography style={{ margin: '10px 0', color: 'red' }}>{message}</Typography>}
          <Button type="submit" color="primary" variant="contained" style={btnstyle} fullWidth>
            Reset Password
          </Button>
        </Paper>
      </Grid>
    </form>
  );
};

export default ResetPassword;

