
import React, { useState } from 'react';
import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useResponsive from "../../hooks/useResponsive";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Grow,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';




const Register: React.FC = () => {
  const { isSmallScreen,isMediumScreen } = useResponsive();

  const [checked, setChecked] = useState(true);
  const paperStyle = {
    padding: '30px 20px',
    width: isMediumScreen? '70%': '30%',
    margin: "20px auto"
  };
  const avatarStyle = { backgroundColor: '#00712D' };
  const marginTop = { marginTop: 5 };
    return (
        <Grid>
      <Grow in={checked}>
            <Paper elevation={5} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
            <Person></Person>
                    </Avatar>
                    <Typography variant='h5' >
                        Sign Up
                    </Typography>
                    <Typography variant='caption' gutterBottom>
                        Please fill this form to create an account!
                    </Typography>
                </Grid>
                <form>
                    <TextField fullWidth label='Name' placeholder="Enter your name" margin="normal" />
                    <TextField fullWidth label='Email' placeholder="Enter your email" margin="normal" />
                    <FormControl component="fieldset" style={marginTop} fullWidth>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='Phone Number' placeholder="Enter your phone number" margin="normal" />
                    <TextField fullWidth label='Password' placeholder="Enter your password" type="password" margin="normal" />
                    <TextField fullWidth label='Confirm Password' placeholder="Confirm your password" type="password" margin="normal" />
                  
                    <Button type='submit' variant='contained' color='primary' fullWidth style={marginTop}>
                        Sign up
                    </Button>
          <Typography variant='subtitle2'sx={{
            color:'gray',margin:1
          }}>Already a User?<Link to="/login"style={{textDecoration:'none'}}> Log In</Link></Typography>
          
                </form>
            </Paper>
            </Grow>
        </Grid>
    );
}

export default Register;

