import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,  // ✅ This is correct
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#A5D6A7',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#F9FAFB',
      paper: mode === 'dark' ? '#1E1E1E' : '#fff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#2C3E50',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default getTheme;
