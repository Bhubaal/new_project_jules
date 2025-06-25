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
      <Grid container spacing={3} alignItems="stretch">
        {/* My Basic Info Card */}
        <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
          <Card variant="outlined" sx={{ ...cardStyle, minHeight: 260, flex: 1 }}>
            <CardHeader title={<Typography variant="h5" fontWeight="bold">My Basic Info</Typography>} />
            <CardContent sx={cardContentStyle}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={user.avatarUrl} sx={{ width: 72, height: 72 }}>
                  {user.name.charAt(0)}
                </Avatar>
                <Box ml={3}>
                  <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
                  <Typography variant="body1" color="textSecondary">{user.email}</Typography>
                </Box>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon><BadgeIcon /></ListItemIcon>
                  <ListItemText primary={<Typography variant="subtitle1">Emp ID</Typography>} secondary={<Typography variant="body1">{user.empId}</Typography>} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DomainIcon /></ListItemIcon>
                  <ListItemText primary={<Typography variant="subtitle1">Domain Name</Typography>} secondary={<Typography variant="body1">{user.domain}</Typography>} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* My Current Project Info Card */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Card variant="outlined" sx={{ ...cardStyle, minHeight: 260, flex: 1 }}>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">My Current Project Info</Typography>} />
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="medium" stickyHeader>
                  <TableBody>
                    {[
                      ['Project Name', project.name],
                      ['Role', project.role],
                      ['Project Joining Date', project.joinDate || '-'],
                      ['Org-Division', project.division],
                      ['Location', project.location],
                    ].map(([label, value]) => (
                      <TableRow key={label}>
                        <TableCell sx={{ fontWeight: 'medium', whiteSpace: 'nowrap', fontSize: '1.1rem' }}>{label}</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem' }}>{value || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Leave Balance Card */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card variant="outlined" sx={{ ...cardStyle, minHeight: 240, flex: 1 }}>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">My Leave Balance</Typography>} />
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="medium" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{whiteSpace: 'nowrap', fontSize: '1.1rem'}}>Leave Type</TableCell>
                      <TableCell align="right" sx={{ fontSize: '1.1rem' }}>Balance</TableCell>
                      <TableCell align="right" sx={{ fontSize: '1.1rem' }}>Allotted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveTypes.map(type => (
                      <TableRow key={type.key}>
                        <TableCell sx={{ fontSize: '1.1rem' }}>
                          <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
                            {type.icon.length > 2 ? <MuiIcon fontSize="medium">{type.icon}</MuiIcon> : type.icon}
                          </Box>
                          {type.label}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '1.1rem' }}>{type.balance}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '1.1rem' }}>{type.allotted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My WFH Balance Card */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card variant="outlined" sx={{ ...cardStyle, minHeight: 240, flex: 1 }}>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">My WFH Balance</Typography>} />
            <CardContent sx={cardContentStyle}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="medium" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{whiteSpace: 'nowrap', fontSize: '1.1rem'}}>WFH Type</TableCell>
                      <TableCell align="right" sx={{ fontSize: '1.1rem' }}>Balance</TableCell>
                      <TableCell align="right" sx={{ fontSize: '1.1rem' }}>Allotted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wfhTypes.map(type => (
                      <TableRow key={type.key}>
                        <TableCell sx={{ fontSize: '1.1rem' }}>
                          <Box component="span" mr={1} sx={{ verticalAlign: 'middle' }}>
                            {type.icon.length > 2 ? <MuiIcon fontSize="medium">{type.icon}</MuiIcon> : type.icon}
                          </Box>
                          {type.label}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '1.1rem' }}>{type.balance}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '1.1rem' }}>{type.allotted}</TableCell>
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
