export const theme = {
    colors: {
      primary: '#007AFF',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: {
        primary: '#1C1C1E',
        secondary: '#8E8E93',
        tertiary: '#C7C7CC',
      },
      border: '#E5E5EA',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    
    typography: {
      size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 28,
        title: 32,
      },
      weight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
      },
    },
    
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    
    shadow: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      },
    },
  };
  
  export type Theme = typeof theme;