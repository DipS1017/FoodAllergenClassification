
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  styled,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Fastfood,
  Home,
  HowToReg,
  ImageSearch,
  ListAlt,
  Menu as MenuIcon,
  AccountCircle,
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
  const { isMediumScreen } = useResponsive();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setUserData] = useState<{
    name: string;
    profileImage: string;
  } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    }

    localStorage.removeItem("authToken");
    setUserData(null);
    handleClose();
    navigate("/");
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const token = localStorage.getItem("authToken");


const navLinks = [
  { text: "Home", icon: <Home fontSize="small" />, path: "/" },
  { text: "AI", icon: <ImageSearch fontSize="small" />, path: "/captured-picture" },
  { text: "About", icon: <ListAlt fontSize="small" />, path: "/about" },
  ...(token
    ? [] // No "Sign Up" link if the user is logged in
    : [{ text: "Sign Up", icon: <HowToReg fontSize="small" />, path: "/register" }]),
];
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
          {/* Logo Section */}
          <Typography variant="h5" sx={{ display: { xs: "none", sm: "block" } }}>
            <StyleLink to="/">
              <Fastfood sx={{ marginX: 2 }} />
              Allergen Classification
            </StyleLink>
          </Typography>
          <StyleLink to="/" sx={{ display: { xs: "block", sm: "none" } }}>
            <Fastfood />
          </StyleLink>

          {/* MenuIcon for Mobile */}
          {isMediumScreen ? (
            <IconButton
              onClick={() => toggleDrawer(true)}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography variant="h6" sx={{ display: "flex", gap: 4 }}>
              {navLinks.map((link, index) => (
                <StyleLink key={index} to={link.path}>
                  {link.icon} {link.text}
                </StyleLink>
              ))}
              {token && (
                <>
                  <IconButton
                    onClick={handleClick}
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <AccountCircle />
                  </IconButton>

                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "user-avatar",
                    }}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Typography>
          )}
        </StyleToolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
   

<Drawer
  anchor="right"
  open={drawerOpen}
  onClose={() => toggleDrawer(false)}
  sx={{
    '& .MuiDrawer-paper': {
      width: 250, // Width of the drawer
    },
  }}
>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
    }}
    role="presentation"
    onClick={() => toggleDrawer(false)}
    onKeyDown={() => toggleDrawer(false)}
  >
    <List sx={{ width: '100%' }}>
      {navLinks.map((link, index) => (
        <ListItem
          button
          key={index}
          component={RouterLink}
          to={link.path}
          sx={{
            marginBottom: '12px', // Space between items
            padding: '8px 16px', // Item padding
            borderRadius: '8px', // Rounded corners
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Shadow under each item
            textAlign: 'center', // Center-align text
            '&:hover': {
              backgroundColor: '#f4f4f4', // Light gray hover effect
            },
          }}
        >
          <ListItemText
            primary={link.text}
            sx={{
              fontWeight: 'bold',
            }}
          />
        </ListItem>
      ))}
      {token && (
        <>
          <Divider sx={{ margin: '8px 0' }} />
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              marginBottom: '12px', // Space between items
              padding: '8px 16px', // Item padding
              borderRadius: '8px', // Rounded corners
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Shadow under each item
              textAlign: 'center', // Center-align text
              '&:hover': {
                backgroundColor: '#f4f4f4', // Light gray hover effect
              },
            }}
          >
            <ListItemText
              primary="Logout"
              sx={{
                fontWeight: 'bold',
                color: '#d32f2f', // Red text color for logout
              }}
            />
          </ListItem>
        </>
      )}
    </List>
  </Box>
</Drawer>


    </Box>
  );
}

export default Navbar;

