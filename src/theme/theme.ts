'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
      light: '#2a2a2a',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#666666',
      light: '#888888',
      dark: '#333333',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
    },
    divider: '#e5e5e5',
    success: {
      main: '#1a7a2e',
      light: '#e8f5e9',
      dark: '#115520',
    },
    warning: {
      main: '#b45309',
      light: '#fef3c7',
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: 600,
    },
    h1: {
      letterSpacing: '-0.04em',
      fontWeight: 800,
    },
    h2: {
      letterSpacing: '-0.03em',
      fontWeight: 700,
    },
    h3: {
      letterSpacing: '-0.02em',
      fontWeight: 700,
    },
    h4: {
      letterSpacing: '-0.02em',
      fontWeight: 600,
    },
    h5: {
      letterSpacing: '-0.01em',
      fontWeight: 600,
    },
    h6: {
      letterSpacing: '-0.01em',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 24px',
          fontSize: '0.8125rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#111111',
          color: '#ffffff !important',
          '&:hover': {
            backgroundColor: '#2c2c2c',
            color: '#ffffff !important',
          },
        },
        outlined: {
          borderColor: '#111111',
          color: '#111111 !important',
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#000000',
            backgroundColor: '#f7f7f5',
            color: '#111111 !important',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e5e5e5',
          borderRadius: 4,
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: '#111111',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#dcdcd8',
            },
            '&:hover fieldset': {
              borderColor: '#888888',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#111111',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            '&.Mui-focused': {
              color: '#111111',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: '#dcdcd8',
          },
          '&:hover fieldset': {
            borderColor: '#888888',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#111111',
            borderWidth: '1.5px',
          },
        },
        input: {
          padding: '12px 14px',
          fontSize: '0.875rem',
        },
        sizeSmall: {
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 12px',
            fontSize: '0.8125rem',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#666666',
          fontSize: '0.875rem',
          '&.Mui-focused': {
            color: '#111111',
          },
        },
        sizeSmall: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& fieldset': {
            borderColor: '#dcdcd8',
          },
          '&:hover fieldset': {
            borderColor: '#888888',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#111111',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        },
        outlined: {
          borderColor: '#e5e5e5',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#111111',
        },
        iconEmpty: {
          color: '#e5e5e5',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#111111',
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '0.8125rem',
          letterSpacing: '0.05em',
          color: '#777777',
          '&.Mui-selected': {
            color: '#111111',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
          border: '1px solid #e5e5e5',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: '1px solid #e5e5e5',
        },
      },
    },
  },
});
