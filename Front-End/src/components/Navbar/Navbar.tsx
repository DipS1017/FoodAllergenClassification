import React from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  Fastfood,
  Home,
  HowToReg,
  ImageSearch,
  ListAlt,
  Menu,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
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

          <Menu sx={{ display: isMediumScreen ? "flex" : "none" }}></Menu>

          <Typography
            variant="h6"
            sx={{ display: isMediumScreen ? "none" : "flex", gap: 4 }}
          >
            <StyleLink to="/">
              <Home fontSize="small" /> Home
            </StyleLink>
            <StyleLink to="/realtime-camera">
              <ImageSearch fontSize="small" /> AI
            </StyleLink>
            <StyleLink to="/about">
              <ListAlt fontSize="small" /> About
            </StyleLink>
            <StyleLink to="/register">
              <HowToReg fontSize="small" /> Sign Up 
            </StyleLink>
          </Typography>
        </StyleToolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
