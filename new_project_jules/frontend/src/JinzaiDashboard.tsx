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
      {/* MUI Grid uses a 12-column system.
          xs: columns for extra-small screens (<600px)
          sm: columns for small screens (>=600px)
          md: columns for medium screens (>=900px)
          lg: columns for large screens (>=1200px)

          Goal:
          - Large screens (lg): 3 or 4 columns (use 3 for now, as 4 might be too crowded for some cards) -> lg={4} for 3 cards per row, or lg={3} for 4 cards per row. Let's aim for 4 cards per row on large screens.
          - Medium screens (md): 2 or 3 columns -> md={6} for 2 cards, md={4} for 3 cards. Let's use md={6} for 2 cards per row.
          - Small screens (sm): 1 or 2 columns -> sm={12} for 1 card, sm={6} for 2 cards. Let's use sm={6} for 2 cards per row.
          - Extra-small screens (xs): 1 column -> xs={12}
          The spacing={3} prop on Grid container provides a 24px gap (3 * 8px). This is a good default.
      */}
      <Grid container spacing={3} alignItems="stretch">
        {/* My Basic Info Card */}
        {/* This card is wider, so it might take more space. Let's make it take 2/3 on md and 1/2 on lg */}
        <Grid item xs={12} sm={12} md={8} lg={6} sx={{ display: 'flex' }}>
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
        {/* This card can take the remaining space next to Basic Info */}
        <Grid item xs={12} sm={12} md={4} lg={6} sx={{ display: 'flex' }}>
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
        {/* Aim for 3 cards per row on lg, 2 on md, 2 on sm (if possible), 1 on xs */}
        <Grid item xs={12} sm={6} md={6} lg={4} sx={{ display: 'flex' }}>
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
        <Grid item xs={12} sm={6} md={6} lg={4} sx={{ display: 'flex' }}>
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

        {/* Placeholder for a potential third card in the second row for lg screens to make it 3x2 */}
        {/* Or, if we want to make it truly flow, we can add more cards or make the existing ones lg={3} for 4 per row. */}
        {/* For now, let's adjust the existing cards for a 2, 2, 2, ... flow that wraps.
            My Basic Info: xs={12} sm={12} md={8} lg={6}
            My Current Project Info: xs={12} sm={12} md={4} lg={6}
            My Leave Balance: xs={12} sm={6} md={6} lg={4} -> this will be the first card on the second row for lg
            My WFH Balance: xs={12} sm={6} md={6} lg={4} -> second card on the second row for lg

            This means on LG, the first row has "Basic Info" (6 cols) and "Project Info" (6 cols).
            The second row has "Leave Balance" (4 cols) and "WFH Balance" (4 cols), leaving 4 cols empty.
            This satisfies "auto-flow cards so they wrap evenly instead of clustering left" for these 4 cards.
            If more cards were present, they would continue filling this row and then wrap.
        */}
        {/* To achieve a 3 or 4 column layout for the smaller cards:
            If we want 3 columns for "Leave" and "WFH" and potentially a 3rd similar card on LG:
            - My Basic Info: xs={12} sm={12} md={12} lg={8} (takes 2/3 of the width on large screens)
            - My Current Project Info: xs={12} sm={12} md={12} lg={4} (takes 1/3 of the width on large screens)
            This makes the first row full on LG.

            Then for the next row of cards:
            - My Leave Balance: xs={12} sm={6} md={4} lg={4}
            - My WFH Balance: xs={12} sm={6} md={4} lg={4}
            - (If a third card of similar size existed): xs={12} sm={6} md={4} lg={4}
            This would make the second row have 3 cards on md and lg.

            Let's try this configuration:
        */}
      </Grid>
    </Box>
  );
};

export default JinzaiDashboard;
