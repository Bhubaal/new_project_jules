import React, { ReactNode, useState } from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// Removed unused ListItem import
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ColorModeContext } from './theme'; // Keep this for theme toggle
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container'; // Added for content wrapping
import Avatar from '@mui/material/Avatar'; // Added for logo
import Badge from '@mui/material/Badge'; // Added for notification badge

// MUI Icons for Sidebar and App Bar
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1, // Correct
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Apply margin and width adjustments regardless of the 'open' state for permanent drawer
  marginLeft: `${drawerWidth}px`,
  width: `calc(100% - ${drawerWidth}px)`,
  ...(open && {
    // These transitions will apply when the drawer opens/closes
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && { // When drawer is closed, AppBar should expand
    marginLeft: `calc(${theme.spacing(7)} + 1px)`, // Match closed drawer width
    width: `calc(100% - (${theme.spacing(7)} + 1px))`,
    [theme.breakpoints.up('sm')]: {
      marginLeft: `calc(${theme.spacing(8)} + 1px)`, // Match closed drawer width on sm screens
      width: `calc(100% - (${theme.spacing(8)} + 1px))`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen, // Use leavingScreen for consistency
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface DashboardLayoutProps {
  children: ReactNode;
  // title prop is no longer needed as it's hardcoded in AppBar
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [open, setOpen] = useState(true); // Drawer is open by default
  const [selectedItem, setSelectedItem] = useState('Dashboard'); // State for selected item

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (text: string) => {
    setSelectedItem(text);
    // Add navigation logic here if needed in the future
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'IV Forum', icon: <ForumIcon /> },
    { text: 'Leave', icon: <BeachAccessIcon /> },
    { text: 'Attendance', icon: <CalendarTodayIcon /> },
    { text: 'Work From Home', icon: <HomeWorkIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', width: '100%' }}> {/* Ensure root Box takes full available width, constrained by viewport */}
      <CssBaseline /> {/* Added CssBaseline */}
      <AppBar position="sticky" open={open} color="default" elevation={1}> {/* Changed position and color, added elevation */}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5, // Keep margin for consistency
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Jinzai Works
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent="99+" color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit">
            <HelpOutlineIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'flex-end', px: open ? 2 : 1 }}>
          {open && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>J</Avatar> {/* Placeholder Logo */}
              <Typography variant="h6" component="div">Jinzai</Typography>
            </Box>
          )}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={selectedItem === item.text}
              onClick={() => handleListItemClick(item.text)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected, // Use theme's selected color
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover, // Use theme's hover color
                    }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
          }),
          // Adjust marginLeft based on the drawer's open state
          marginLeft: open ? `${drawerWidth}px` : `calc(${theme.spacing(7)} + 1px)`,
          [theme.breakpoints.up('sm')]: {
            marginLeft: open ? `${drawerWidth}px` : `calc(${theme.spacing(8)} + 1px)`,
          },
          // AppBar is sticky, so add padding top to this Box to avoid content overlap
          // Use theme.mixins.toolbar.minHeight if available, otherwise fallback to a common value like 64px.
          pt: typeof theme.mixins.toolbar.minHeight === 'number'
              ? `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(3)})`
              : `calc(64px + ${theme.spacing(3)})`,
          pb: theme.spacing(3), // Padding at the bottom
          // The Container below will manage its own horizontal spacing based on maxWidth,
          // but we can add outer horizontal padding to the Box if needed.
          // For now, let's rely on the Container.
        }}
      >
        {/* No DrawerHeader needed here as AppBar is sticky and pt is handled above */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
