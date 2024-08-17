
import React from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  styled,
} from "@mui/material";
import { Fastfood, Home, ImageSearch, ListAlt } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

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
  return (
    <Box>
      <AppBar position="sticky" sx={{
        padding:'0.5% 2%',
  backgroundColor: "#00712D",
      }}>
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
          <Typography variant="h6" sx={{ display: "flex", gap: 4 }}>
            <StyleLink to="/">
              <Home fontSize="small" /> Home
            </StyleLink>
            <StyleLink to="/realtime-camera">
              <ImageSearch fontSize="small" /> AI
            </StyleLink>
            <StyleLink to="/about">
              <ListAlt fontSize="small" /> About
            </StyleLink>
          </Typography>
        </StyleToolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

