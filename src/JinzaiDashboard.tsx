import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Icon as MuiIcon, // Renamed to avoid conflict if user defines a local 'Icon'
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import DomainIcon from '@mui/icons-material/Domain';

// Hardcoded data
const user = {
  name: 'Jules Verne',
  email: 'jules.verne@example.com',
  avatarUrl: '/path/to/avatar.jpg', // Replace with a real path or remove if not available
  empId: 'EMP007',
  domain: 'Technology',
};

const project = {
  name: 'AC_CORE',
  role: 'SOFTWARE TRAINEE',
  joinDate: '2023-01-15',
  division: 'WAP-AC',
  location: 'Chennai',
};

const leaveTypes = [
  { key: 'EL', label: 'EL', icon: '⏳', balance: 5, allotted: 12 },
  { key: 'CL', label: 'CL', icon: '🗓️', balance: 2, allotted: 7 },
  { key: 'SL', label: 'SL', icon: '🤒', balance: 8, allotted: 10 },
];

const wfhTypes = [
  { key: 'GENERAL', label: 'GENERAL', icon: '🏠', balance: 3, allotted: 6 },
  { key: 'SPECIAL', label: 'SPECIAL', icon: '🏡', balance: 1, allotted: 2 },
];

const cardStyle = {
  borderRadius: 2,
  boxShadow: 1,
  height: '100%', // Ensure cards in the same row have the same height
};

const JinzaiDashboard: React.FC = () => {
  return (
    // <Box p={3}> // Temporarily remove padding to test layout
    <Box>
      <Grid container spacing={3}>
        {/* My Basic Info Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My Basic Info" />
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={user.avatarUrl} sx={{ width: 56, height: 56 }}>
                  {user.name.charAt(0)} {/* Fallback to initial if avatar fails */}
                </Avatar>
                <Box ml={2}>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                </Box>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon><BadgeIcon /></ListItemIcon>
                  <ListItemText primary="Emp ID" secondary={user.empId} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DomainIcon /></ListItemIcon>
                  <ListItemText primary="Domain Name" secondary={user.domain} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* My Current Project Info Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My Current Project Info" />
            <CardContent>
              <Table size="small">
                <TableBody>
                  {[
                    ['Project Name', project.name],
                    ['Role', project.role],
                    ['Project Joining Date', project.joinDate || '-'],
                    ['Org-Division', project.division],
                    ['Location', project.location],
                  ].map(([label, value]) => (
                    <TableRow key={label}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{label}</TableCell>
                      <TableCell>{value || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* My Leave Balance Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My Leave Balance" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="right">Allotted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveTypes.map(type => (
                    <TableRow key={type.key}>
                      <TableCell>
                        <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
                           {/* Using MuiIcon for material icons, or direct emoji */}
                           {type.icon.length > 2 ? <MuiIcon fontSize="small">{type.icon}</MuiIcon> : type.icon}
                        </Box>
                        {type.label}
                      </TableCell>
                      <TableCell align="right">{type.balance}</TableCell>
                      <TableCell align="right">{type.allotted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* My WFH Balance Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My WFH Balance" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>WFH Type</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="right">Allotted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wfhTypes.map(type => (
                    <TableRow key={type.key}>
                      <TableCell>
                        <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
                          {/* Using MuiIcon for material icons, or direct emoji */}
                          {type.icon.length > 2 ? <MuiIcon fontSize="small">{type.icon}</MuiIcon> : type.icon}
                        </Box>
                        {type.label}
                      </TableCell>
                      <TableCell align="right">{type.balance}</TableCell>
                      <TableCell align="right">{type.allotted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JinzaiDashboard;
