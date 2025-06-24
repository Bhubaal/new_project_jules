import { PaletteMode, createTheme } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import React from 'react';

// Define placeholder brand tokens
const placeholderBrandColors = {
  primary: amber, // Example primary color
  secondary: deepOrange, // Example secondary color
  neutral: grey, // Example neutral color
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette values for light mode
          primary: placeholderBrandColors.primary,
          divider: placeholderBrandColors.primary[200],
          text: {
            primary: placeholderBrandColors.neutral[900],
            secondary: placeholderBrandColors.neutral[800],
          },
          background: {
            default: '#ffffff',
            paper: placeholderBrandColors.neutral[50],
          }
        }
      : {
          // Palette values for dark mode
          primary: placeholderBrandColors.secondary,
          divider: placeholderBrandColors.neutral[700],
          background: {
            default: placeholderBrandColors.neutral[900],
            paper: placeholderBrandColors.neutral[800],
          },
          text: {
            primary: '#fff',
            secondary: placeholderBrandColors.neutral[500],
          },
        }),
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','), // Example font
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    // Add more typography variants as needed
  },
  spacing: 8, // Base spacing unit
  components: {
    // Example: Default props for MuiButton
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // No uppercase buttons
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: '12px', // More rounded cards
            }
        }
    }
  },
});

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const useColorMode = () => {
  const [mode, setMode] = React.useState<PaletteMode>(() => {
    try {
      const item = window.localStorage.getItem('colorMode');
      return item ? (item as PaletteMode) : 'light';
    } catch (error) {
      console.log(error);
      return 'light';
    }
  });

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          try {
            window.localStorage.setItem('colorMode', newMode);
          } catch (error) {
            console.log(error);
          }
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return { theme, mode, toggleColorMode: colorMode.toggleColorMode };
};
