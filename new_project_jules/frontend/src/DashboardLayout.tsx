import React, { ReactNode, useEffect, useState } from 'react';
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
import Collapse from '@mui/material/Collapse'; // Added for nested lists
import ExpandLess from '@mui/icons-material/ExpandLess'; // Icon for open submenu
import ExpandMore from '@mui/icons-material/ExpandMore'; // Icon for closed submenu
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
import BeachAccessIcon from '@mui/icons-material/BeachAccess'; // Main Leave icon
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Main Attendance icon
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Main Work From Home icon
import NotificationsIcon from '@mui/icons-material/Notifications';
// Icons for sub-items
import ListAltIcon from '@mui/icons-material/ListAlt'; // For "Request"
import EventIcon from '@mui/icons-material/Event'; // For "Holidays"
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // For "Conflict Leaves"
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Icon for Admin Page
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({}); // State for submenus
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for logout menu

  useEffect(() => {
    const superuserStatus = localStorage.getItem('is_superuser') === 'true';
    setIsSuperuser(superuserStatus);
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Define menu items with paths
  const baseMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'IV Forum', icon: <ForumIcon />, path: '/iv-forum' },
    {
      text: 'Leave',
      icon: <BeachAccessIcon />,
      children: [
        { text: 'Leave Requests', icon: <ListAltIcon />, path: '/leaves/request' }, // New Link
        { text: 'Holidays', icon: <EventIcon />, path: '/leave/holidays' },
        { text: 'Conflict Leaves', icon: <ReportProblemIcon />, path: '/leave/conflict-leaves' },
      ]
    },
    {
      text: 'Attendance',
      icon: <CalendarTodayIcon />,
      children: [
        { text: 'Request', icon: <ListAltIcon />, path: '/attendance/request' },
        // Future items can be added here
      ]
    },
    {
      text: 'Work From Home',
      icon: <HomeWorkIcon />,
      children: [
        { text: 'My Requests', icon: <ListAltIcon />, path: '/work-from-home/requests' }, // Updated text and path
      ]
    },
  ];

  const adminMenuItem = {
    text: 'Admin Management',
    icon: <AdminPanelSettingsIcon />,
    path: '/admin/manage-records',
  };

  const menuItems = isSuperuser ? [adminMenuItem] : baseMenuItems;

  const handleListItemClick = (text: string, path?: string, isParent: boolean = false) => {
    if (path && !isParent) { // Navigable child or standalone item
      setSelectedItem(text);
      navigate(path);
    } else if (isParent) { // Parent item, toggle submenu
      setOpenSubmenus(prev => ({ ...prev, [text]: !prev[text] }));
      // Optionally, decide if clicking a parent should change the selectedItem
      // For now, let's not change selectedItem when only toggling a submenu
    } else if (path && isParent) { // Parent item itself is clickable & has a path (not used in current design but for completeness)
        setSelectedItem(text);
        navigate(path);
        // Also toggle submenu if it has children
        if (baseMenuItems.find(item => item.text === text)?.children) { // Check baseMenuItems for children logic
            setOpenSubmenus(prev => ({ ...prev, [text]: !prev[text] }));
        }
    }
    // If it's a parent item without a direct path, selectedItem is not changed here,
    // allowing the current page's title to remain.
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token'); // Remove JWT token
    localStorage.removeItem('is_superuser'); // Remove superuser status
    navigate('/login'); // Redirect to login page
    handleClose();
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
            <RefreshIcon color="inherit" />
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <HelpOutlineIcon color="inherit" />
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon color="inherit" />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={handleMenu}
          >
            <AccountCircleIcon color="inherit" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ ml: 1 }}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon color="inherit" /> : <Brightness4Icon color="inherit" />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {/* Space for icon and title */}
          {open && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingLeft: 2, paddingTop: 1, paddingBottom: 1 }}> {/* Increased paddingLeft */}
              <img src={logoWhite} alt="Jinzai Logo" style={{ width: 40, height: 40, marginRight: 16 }} />
              <Typography variant="h4" noWrap component="div" sx={{ fontWeight: 'bold' }}> {/* Increased variant to h4 */}
                Jinzai
              </Typography>
            </Box>
          )}
          {!open && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: 1, paddingBottom: 1 }}>
              <img src={logoWhite} alt="Jinzai Logo" style={{ width: 40, height: 40 }} />
            </Box>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItemButton
                selected={selectedItem === item.text && !item.children}
                onClick={() => handleListItemClick(item.text, item.path, !!item.children)}
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
                {open && item.children && (openSubmenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              {item.children && open && (
                <Collapse in={openSubmenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.text}
                        selected={selectedItem === child.text}
                        onClick={() => handleListItemClick(child.text, child.path)}
                        sx={{
                          paddingLeft: theme.spacing(4), // Explicitly set left padding for indentation
                          paddingRight: theme.spacing(2.5), // Maintain right padding
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText primary={child.text} sx={{ opacity: open ? 1 : 0 }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          // Removed transition for margin and marginLeft property
          pt: typeof theme.mixins.toolbar.minHeight === 'number'
              ? `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(3)})`
              : `calc(64px + ${theme.spacing(3)})`,
          pb: theme.spacing(3),
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
