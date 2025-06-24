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
  Icon as MuiIcon,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import DomainIcon from '@mui/icons-material/Domain';

// Hardcoded data (copied from original)
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
  // borderRadius: 2, // Using default MUI Card rounding, can be themed globally
  // boxShadow: 1, // Using default MUI Card elevation, can be themed globally
  height: '100%', // Ensure cards in the same row have the same height
  display: 'flex', // Added to help manage CardContent height
  flexDirection: 'column', // Added
};

const cardContentStyle = {
  flexGrow: 1, // Added to allow content to expand
  overflowY: 'auto', // Added in case content overflows vertically
};


const JinzaiDashboard: React.FC = () => {
  return (
    // Root Box - no padding here, DashboardLayout's Container handles it
    <Box>
      <Grid container spacing={3}>
        {/* My Basic Info Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My Basic Info" />
            <CardContent sx={cardContentStyle}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={user.avatarUrl} sx={{ width: 56, height: 56 }}>
                  {user.name.charAt(0)}
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
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}> {/* Key change: scrollable Box for table */}
                <Table size="small" stickyHeader > {/* Added stickyHeader for better scroll experience */}
                  <TableBody>
                    {[
                      ['Project Name', project.name],
                      ['Role', project.role],
                      ['Project Joining Date', project.joinDate || '-'],
                      ['Org-Division', project.division],
                      ['Location', project.location],
                    ].map(([label, value]) => (
                      <TableRow key={label}>
                        <TableCell sx={{ fontWeight: 'medium', whiteSpace: 'nowrap' }}>{label}</TableCell> {/* Added whiteSpace for labels */}
                        <TableCell>{value || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Leave Balance Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My Leave Balance" />
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}> {/* Key change: scrollable Box for table */}
                <Table size="small" stickyHeader> {/* Added stickyHeader */}
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{whiteSpace: 'nowrap'}}>Leave Type</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Allotted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveTypes.map(type => (
                      <TableRow key={type.key}>
                        <TableCell>
                          <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My WFH Balance Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={cardStyle}>
            <CardHeader title="My WFH Balance" />
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}> {/* Key change: scrollable Box for table */}
                <Table size="small" stickyHeader> {/* Added stickyHeader */}
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{whiteSpace: 'nowrap'}}>WFH Type</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Allotted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wfhTypes.map(type => (
                      <TableRow key={type.key}>
                        <TableCell>
                          <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JinzaiDashboard;
