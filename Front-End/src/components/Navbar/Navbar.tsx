
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  styled,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Fastfood,
  Home,
  AccountCircle,
  HowToReg,
  ImageSearch,
  ListAlt,
  Menu as MenuIcon,
  AccountBoxSharp,
  AccountCircleRounded,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import axios from "axios";

// Styled Toolbar
const StyleToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

// Styled Link
const StyleLink = styled(RouterLink)({
  color: "white",
  textDecoration: "none",
  cursor: "pointer",

  "&:hover": {
    textDecoration: "underline",
  },
});

function Navbar() {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<{ name: string; profileImage: string } | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      // Call an API endpoint to invalidate the token
      await axios.post('/api/logout'); // Ensure you have this route set up
    } catch (error) {
      console.error('Error during logout:', error);
    }

    localStorage.removeItem('authToken');
    setUserData(null); // Clear user data
    handleClose();
    navigate("/");
  };

  // Fetch user data on mount if token is present
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const token = localStorage.getItem('authToken'); // Check for token

  return (
    <Box>
      <AppBar
        position="sticky"
        sx={{
          padding: "0.5% 2%",
          backgroundColor: "#00712D",
        }}
      >
        <StyleToolbar>
          <Typography
            variant="h5"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <StyleLink to="/">
              <Fastfood sx={{ marginX: 2 }} />
              Allergen Classification
            </StyleLink>
          </Typography>
          <Fastfood sx={{ display: { xs: "flex", sm: "none" } }} />

          {/* The MenuIcon is displayed on medium screens */}
          <MenuIcon sx={{ display: isMediumScreen ? "flex" : "none" }} />

          <Typography
            variant="h6"
            sx={{ display: isMediumScreen ? "none" : "flex", gap: 4 }}
          >
            <StyleLink to="/">
              <Home fontSize="small" /> Home
            </StyleLink>
            <StyleLink to="/captured-picture">
              <ImageSearch fontSize="small" /> AI
            </StyleLink>
            <StyleLink to="/about">
              <ListAlt fontSize="small" /> About
            </StyleLink>
            {!token && (
              <StyleLink to="/register">
                <HowToReg fontSize="small" /> Sign Up
              </StyleLink>
            )}

          {token && (
            <>
              <AccountCircleRounded
                onClick={handleClick}
                
              >

              </AccountCircleRounded>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'user-avatar',
                }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}

          </Typography>
        </StyleToolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

