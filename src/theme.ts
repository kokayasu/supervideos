import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1100,
      xl: 1400,
    },
  },
  palette: {
    primary: {
      main: "#F6C7C7",
      // main: '#ffd9e8',
    },
    secondary: {
      main: "#4a266a",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "1rem",
      fontWeight: 500,
      "@media (min-width:600px)": {
        fontSize: "1.4rem",
      },
    },
    h2: {
      fontSize: "1.3rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiPagination: {
      defaultProps: {
        shape: "rounded",
        variant: "outlined",
      },
    },
  },
});

export default theme;
