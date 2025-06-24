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
          divider: jinzaiBrandColors.neutral[300], // Adjusted divider for better visibility
          text: {
            primary: jinzaiBrandColors.neutral[900],
            secondary: jinzaiBrandColors.neutral[700], // Adjusted for better contrast
          },
          background: {
            default: '#f4f6f8', // Changed to light grey
            paper: jinzaiBrandColors.neutral[50], // Paper can remain lighter or also be adjusted
          }
        }
      : {
          // Palette values for dark mode
          divider: jinzaiBrandColors.neutral[700],
          background: {
            default: jinzaiBrandColors.neutral[900],
            paper: jinzaiBrandColors.neutral[800],
          },
          text: {
            primary: '#fff',
            secondary: jinzaiBrandColors.neutral[400], // Adjusted for better visibility
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
