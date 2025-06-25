import React, { ReactNode, isValidElement } from 'react';
import { Card, CardContent, Typography, Skeleton, Box, useTheme, PaletteColor } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode; // Can be an SVG icon component or other ReactNode
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, loading }) => {
  const theme = useTheme();

  // Determine the color for the icon and value text
  const resolvedColor = color ? (theme.palette[color] as PaletteColor)?.main : theme.palette.text.primary;

  return (
    <Card sx={{
        height: '100%',
        minHeight: 220, // Increased minimum height
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        maxWidth: 400, // Make card wider by default
        margin: '0 auto', // Center card if possible
        }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" sx={{ mb: 1.5 }} />
            <Skeleton variant="rectangular" height={44} /> {/* Slightly taller skeleton */}
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {icon && isValidElement(icon) && (
                <Box component="span" sx={{ mr: 2, color: resolvedColor, display: 'flex', alignItems: 'center' }}>
                  {/* Clone the icon to apply styles, ensuring it's a valid element */}
                  {React.cloneElement(icon as React.ReactElement<any>, {
                    sx: {
                      fontSize: '2.7rem', // Larger icon
                      ...( (icon as React.ReactElement<any>).props?.sx || {} )
                    }
                  })}
                </Box>
              )}
              <Typography
                variant="h6" // Larger title
                component="div"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', fontWeight: 'bold', lineHeight: 1.4 }}
              >
                {title}
              </Typography>
            </Box>
            <Typography
              variant="h3" // Larger value
              component="p"
              sx={{ fontWeight: 'bold', color: resolvedColor, lineHeight: 1.2 }}
            >
              {value}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
