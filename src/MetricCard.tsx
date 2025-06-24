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
        display: 'flex',
        flexDirection: 'column',
        // Consider adding a subtle background tint based on 'color' prop if desired
        // backgroundColor: color ? alpha(resolvedColor, 0.05) : undefined,
        }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" sx={{ mb: 1.5 }} />
            <Skeleton variant="rectangular" height={36} />
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              {icon && isValidElement(icon) && (
                <Box component="span" sx={{ mr: 1.5, color: resolvedColor, display: 'flex', alignItems: 'center' }}>
                  {/* Clone the icon to apply styles, ensuring it's a valid element */}
                  {React.cloneElement(icon, { sx: { fontSize: '2rem', ...icon.props.sx } })}
                </Box>
              )}
              <Typography
                variant="subtitle2" // Using subtitle2 for a slightly less prominent title
                component="div"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', fontWeight: 'medium', lineHeight: 1.4 }}
              >
                {title}
              </Typography>
            </Box>
            <Typography
              variant="h4"
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
