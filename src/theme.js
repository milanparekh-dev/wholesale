import { createTheme } from "@mui/material/styles";

export const darkPalette = {
  background: {
    default: "#0f1115",
    paper: "#161b22",
    elevated: "#1f262d",
    subtle: "#1b2028",
  },
  text: {
    primary: "#f5f7fa",
    secondary: "#c9d1d9",
    muted: "#8b949e",
  },
  primary: "#8ab4f8",
  secondary: "#f28b82",
  divider: "#30363d",
  success: "#4caf50",
  warning: "#ffb74d",
  danger: "#ef5350",
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: darkPalette.primary },
    secondary: { main: darkPalette.secondary },
    background: {
      default: darkPalette.background.default,
      paper: darkPalette.background.paper,
      elevated: darkPalette.background.elevated,
      subtle: darkPalette.background.subtle,
    },
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
    },
    divider: darkPalette.divider,
    success: { main: darkPalette.success },
    warning: { main: darkPalette.warning },
    error: { main: darkPalette.danger },
  },
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    button: { textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: darkPalette.background.default,
          color: darkPalette.text.primary,
        },
        "*::selection": {
          backgroundColor: darkPalette.secondary,
          color: darkPalette.background.default,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: darkPalette.background.paper,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: darkPalette.background.elevated,
        },
      },
    },
  },
});
