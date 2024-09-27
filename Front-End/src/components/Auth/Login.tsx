
import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography, Grow } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import axios from 'axios';

const Login:React.FC = () => {
  const {isMediumScreen}=useResponsive();
  const navigate=useNavigate();
 const [email,setEmail] =useState('');
 const [password,setPassword] =useState('');
  const [checked ] = useState(true);
  const paperStyle = { padding: 20, height: '60vh', width:isMediumScreen?'70%': '30%', margin: "20px auto" };
  const avatarStyle = { backgroundColor:  '#00712D'};
  const btnstyle = { margin: '8px 0' };

const [error, setError] = useState<string | null>(null);

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  console.log({ email, password });
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    console.log('Received token:', response.data.token); // Log the token
    localStorage.setItem('authToken', response.data.token); // Store the token in localStorage
    navigate('/');
  } catch (err: any) {
    console.error("Login failed", err);
    setError('Login failed. Please check your credentials and try again.');
  }
}


  return (
    <form onSubmit={handleSubmit}>
    <Grid container justifyContent="center">
      <Grow in={checked}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <Typography variant="h5">Sign In</Typography>
        </Grid>
        <TextField label='Email'value={email} placeholder='Enter Email' margin='normal'fullWidth required onChange={(e)=>setEmail(e.target.value)} />

        <TextField label='Password'value={password} placeholder='Enter password' margin='normal' type='password' fullWidth required onChange={(e)=>setPassword(e.target.value)}/>
        <FormControlLabel
          control={
            <Checkbox
              name="checkedB"
              color="primary"
            />
          } 
          label="Remember me"
        />
        <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
        <Typography>
          <RouterLink to="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>
            Forgot password?
          </RouterLink>
        </Typography>
        <Typography>
          Do you have an account?
          <RouterLink to="/register" style={{ textDecoration: 'none', color:  '#00712D', marginLeft: 5 }}>
            Sign Up 
          </RouterLink>
        </Typography>
      </Paper>
      </Grow>
    </Grid>
</form>
  );
}

export default Login;

