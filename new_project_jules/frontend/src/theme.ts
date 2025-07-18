import { PaletteMode, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors'; // Removed amber and deepOrange
import React from 'react';

// Define Jinzai brand tokens
const jinzaiBrandColors = {
  primary: '#0D47A1',
  secondary: '#1976D2',
  neutral: grey,
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: jinzaiBrandColors.primary,
    },
    secondary: {
      main: jinzaiBrandColors.secondary,
    },
    ...(mode === 'light'
      ? {
          // Palette values for light mode
          primary: {
            main: '#6200EE', // Primary
          },
          secondary: {
            main: '#018786', // Secondary
          },
          error: {
            main: '#B00020', // Error
          },
          divider: '#E0E0E0', // Divider/Border
          text: {
            primary: '#1F1F1F', // Text Primary
            secondary: '#5F5F5F', // Text Secondary
          },
          background: {
            default: '#FFFFFF', // Background
            paper: '#F5F5F5', // Surface
          }
        }
      : {
          // Palette values for dark mode
          primary: {
            main: '#4A90E2', // Accent (e.g. for icons, highlights, and buttons)
          },
          secondary: {
            main: '#4A90E2', // Using Accent for secondary as well, can be adjusted
          },
          error: {
            main: '#CF6679', // Error (keeping existing error color)
          },
          success: {
            main: '#4CAF50', // Verdant Success (keeping existing success color)
          },
          divider: '#3A3A3A', // Borders & Dividers
          background: {
            default: '#2E2E2E', // Background
            paper: '#1F1F1F', // Cards & Panels
          },
          text: {
            primary: '#E0E0E0', // Text Primary
            secondary: '#B0B0B0', // Text Secondary
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
        variant: 'contained' as const, // Ensure it's treated as a literal type
      },
      styleOverrides: {
        root: {
          textTransform: 'none' as const, // No uppercase buttons
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
