
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  styled,
  Avatar,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Fastfood,
  Home,
  HowToReg,
  ImageSearch,
  ListAlt,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import UserProfile from "../Profile/UserProfile";

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
  
  // State for handling the menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Menu open handler
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Menu close handler
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <StyleLink to="/register">
              <HowToReg fontSize="small" /> Sign Up
            </StyleLink>
          <UserProfile/>
          </Typography>
        </StyleToolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

