
import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography, Grow } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';

const Login:React.FC = () => {
  const {isMediumScreen}=useResponsive();
  
  const [checked, setChecked] = useState(true);
  const paperStyle = { padding: 20, height: '60vh', width:isMediumScreen?'70%': '30%', margin: "20px auto" };
  const avatarStyle = { backgroundColor:  '#00712D'};
  const btnstyle = { margin: '8px 0' };


  return (
    <Grid container justifyContent="center">
      <Grow in={checked}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <Typography variant="h5">Sign In</Typography>
        </Grid>
        <TextField label='Username' placeholder='Enter username' margin='normal'fullWidth required />

        <TextField label='Password' placeholder='Enter password' margin='normal' type='password' fullWidth required />
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
  );
}

export default Login;

