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
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { ColorModeContext } from './theme'; // Keep this for theme toggle
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container'; // Added for content wrapping
import Avatar from '@mui/material/Avatar'; // Added for logo
import Badge from '@mui/material/Badge'; // Added for notification badge
import logoWhite from './assets/logo_white.png';

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
  const navigate = useNavigate(); // Added for navigation
  const [open, setOpen] = useState(true); // Drawer is open by default
  const [selectedItem, setSelectedItem] = useState('Dashboard'); // State for selected item

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Define menu items with paths
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'IV Forum', icon: <ForumIcon />, path: '/iv-forum' },
    { text: 'Leave', icon: <BeachAccessIcon />, path: '/leave' },
    { text: 'Attendance', icon: <CalendarTodayIcon />, path: '/attendance' },
    { text: 'Work From Home', icon: <HomeWorkIcon />, path: '/work-from-home' },
  ];

  const handleListItemClick = (text: string, path: string) => {
    setSelectedItem(text);
    navigate(path); // Navigate to the specified path
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          {/* Avatar and JINZAI Typography removed from AppBar */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedItem} {/* Display the selected page name */}
          </Typography>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <HelpOutlineIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircleIcon />
          </IconButton>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ ml: 1 }}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {/* Space for icon and title */}
          {open && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingLeft: 1, paddingTop: 1, paddingBottom: 1 }}>
              {/* Placeholder for an icon, you can replace <img> with an Icon component */}
              <img src={logoWhite} alt="Jinzai Logo" style={{ width: 40, height: 40, marginRight: 16 }} />
              <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                Jinzai
              </Typography>
            </Box>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={item.text}
              selected={selectedItem === item.text}
              onClick={() => handleListItemClick(item.text, item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
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
