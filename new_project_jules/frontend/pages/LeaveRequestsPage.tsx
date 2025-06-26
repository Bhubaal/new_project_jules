import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Select, MenuItem, IconButton, InputLabel, FormControl, Paper, Button, Switch, FormGroup, FormControlLabel
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SyncProblemIcon from '@mui/icons-material/SyncProblem'; // Example for a tilde icon, or use Typography
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

// import FilterListIcon from '@mui/icons-material/FilterList'; // Example for a filter button if needed

const LeaveRequestsPage: React.FC = () => {
  const [leaveType, setLeaveType] = useState('');
  const [days, setDays] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [onDuty, setOnDuty] = useState(false);

  // TODO: Add handlers for filter changes
  const handleOnDutyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnDuty(event.target.checked);
  };

  // Placeholder for request count
  const requestCount = 10;

  // Sample Data for Leave Requests Table
  const leaveRequestsData: GridRowsProp = [
    { id: 1, user: 'Alice Wonderland', leaveType: 'Annual Leave', days: 3, fromDate: '2024-03-10', toDate: '2024-03-12', status: 'Approved', comments: 'Vacation to Disneyland' },
    { id: 2, user: 'Bob The Builder', leaveType: 'Sick Leave', days: 1, fromDate: '2024-04-01', toDate: '2024-04-01', status: 'Approved', comments: 'Flu symptoms' },
    { id: 3, user: 'Charlie Brown', leaveType: 'Casual Leave', days: 1, fromDate: '2024-05-05', toDate: '2024-05-05', status: 'Pending', comments: 'Personal Errand' },
    { id: 4, user: 'Diana Prince', leaveType: 'Annual Leave', days: 5, fromDate: '2024-06-15', toDate: '2024-06-20', status: 'Approved', comments: 'Family Trip to Themyscira' },
    { id: 5, user: 'Edward Scissorhands', leaveType: 'Unpaid Leave', days: 10, fromDate: '2024-07-01', toDate: '2024-07-10', status: 'Rejected', comments: 'Extended personal project, insufficient balance' },
    { id: 6, user: 'Fiona Gallagher', leaveType: 'Sick Leave', days: 2, fromDate: '2024-07-05', toDate: '2024-07-06', status: 'Pending', comments: 'Migraine' },
  ];

  const columns: GridColDef[] = [
    { field: 'user', headerName: 'Employee', width: 180 }, // Added Employee column as it's typical for such a view
    { field: 'leaveType', headerName: 'Leave Type', width: 150 },
    { field: 'days', headerName: 'Day(s)', type: 'number', width: 90 },
    {
      field: 'dateRange',
      headerName: 'Date',
      width: 230,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.row.fromDate}
          <Typography sx={{ mx: 1 }}>~</Typography> {/* Using Typography for tilde */}
          {params.row.toDate}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: params.value === 'Approved' ? 'success.main' : params.value === 'Rejected' ? 'error.main' : 'warning.main' }}>
          <VisibilityIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
          {params.value}
        </Box>
      ),
    },
    { field: 'comments', headerName: 'Comments', width: 250, sortable: false },
    {
      field: 'actions',
      headerName: 'Withdraw',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="withdraw leave request"
          onClick={() => console.log('Withdraw request:', params.id)} // Replace with actual handler
          disabled={params.row.status !== 'Pending'} // Example: disable if not pending
        >
          <DeleteOutlineIcon />
        </IconButton>
      ),
    },
  ];


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <IconButton aria-label="search">
                <SearchIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="leave-type-filter-label">Leave Type</InputLabel>
                <Select
                  labelId="leave-type-filter-label"
                  label="Leave Type"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  aria-label="Filter by leave type"
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="annual">Annual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="casual">Casual Leave</MenuItem>
                  <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <TextField
                label="Days"
                variant="outlined"
                size="small"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                aria-label="Filter by number of days"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true, variant: 'outlined' } }}
                aria-label="Filter by start date"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true, variant: 'outlined' } }}
                aria-label="Filter by end date"
              />
            </Grid>
            {/* Spacer to push subsequent items if any, or just to fill space */}
            <Grid item xs />
          </Grid>
        </Paper>

        {/* Secondary Header Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="withdrawn">Withdrawn</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {requestCount} requests
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={onDuty} onChange={handleOnDutyChange} />}
                label="On Duty"
                aria-label="Toggle on duty status"
              />
            </FormGroup>
            <Button
              variant="outlined"
              startIcon={<BarChartIcon />}
              aria-label="View leave balance"
              size="medium"
            >
              Leave Balance
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              aria-label="Create new leave request"
              size="medium"
            >
              New Request
            </Button>
          </Box>
        </Box>

        {/* Data table will go here */}
        <Typography variant="h6" sx={{ mb: 2, display: 'none' }}> {/* Hidden for now, table will have its own title or imply it */}
          Leave Requests List
        </Typography>

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={leaveRequestsData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            // autoHeight // Consider if autoHeight is preferred over fixed height
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveRequestsPage;
