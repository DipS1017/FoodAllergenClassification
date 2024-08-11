import React from "react";
import {
  AppBar,
  Box,
  Link,
  List,
  ListItemIcon,
  MenuList,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { Fastfood, Home, ImageSearch, Info, ListAlt} from "@mui/icons-material";

const StyleToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#454B1B",
});
const StyleLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  cursor: "pointer",

  "&:hover": {
    textDecoration: "underline",
  },
});
function Navbar() {
  return (
    <>
      <Box>
        <AppBar position="sticky">
          <StyleToolbar>
            <Typography
              variant="h5"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              FoodAllergen Detection
              <Fastfood sx={{ marginX: 2 }} />
            </Typography>

            <Fastfood sx={{ display: { xs: "flex", sm: "none" } }} />
            <Typography variant="h6" sx={{ display: "flex", gap: 4, }}>
              <StyleLink><Home fontSize="small"/>Home</StyleLink>
              <StyleLink><ImageSearch fontSize="small"/>AI</StyleLink>
              <StyleLink><ListAlt fontSize="small"/>About</StyleLink>
            </Typography>
          </StyleToolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Navbar;
