import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Select, MenuItem, IconButton, InputLabel, FormControl, Paper, Button, Switch, FormGroup, FormControlLabel
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart'; // Will change this later if needed
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Added for WFH Policy button
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import SyncProblemIcon from '@mui/icons-material/SyncProblem'; // Example for a tilde icon, or use Typography - Not needed for WFH
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

const WorkFromHomeRequestsPage: React.FC = () => {
  const [requestType, setRequestType] = useState(''); // Changed from leaveType
  const [days, setDays] = useState(''); // Kept for now, might be relevant for WFH duration
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  // const [onDuty, setOnDuty] = useState(false); // Removed 'On Duty' switch, less relevant for WFH requests

  // Placeholder for request count
  const requestCount = 5; // Adjusted sample count

  // Sample Data for Work From Home Requests Table
  const workFromHomeRequestsData: GridRowsProp = [
    { id: 1, user: 'Alice Wonderland', requestType: 'Full Week', days: 5, fromDate: '2024-07-22', toDate: '2024-07-26', status: 'Approved', comments: 'Project X deadline focus' },
    { id: 2, user: 'Bob The Builder', requestType: 'Partial Week', days: 3, fromDate: '2024-07-22', toDate: '2024-07-24', status: 'Pending', comments: 'Doctor appointment on Thursday' },
    { id: 3, user: 'Charlie Brown', requestType: 'Full Week', days: 5, fromDate: '2024-07-29', toDate: '2024-08-02', status: 'Approved', comments: 'Family visiting' },
    { id: 4, user: 'Diana Prince', requestType: 'Specific Days', days: 2, fromDate: '2024-08-05', toDate: '2024-08-06', status: 'Rejected', comments: 'Needs to be in office for client meeting' },
    { id: 5, user: 'Edward Scissorhands', requestType: 'Full Week', days: 5, fromDate: '2024-08-12', toDate: '2024-08-16', status: 'Pending', comments: 'Deep work on new feature' },
  ];

  const columns: GridColDef[] = [
    { field: 'user', headerName: 'Employee', width: 180 },
    { field: 'requestType', headerName: 'Request Type', width: 150 }, // Changed from Leave Type
    { field: 'days', headerName: 'Day(s)', type: 'number', width: 90 },
    {
      field: 'dateRange',
      headerName: 'Date',
      width: 230,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.row.fromDate}
          <Typography sx={{ mx: 1 }}>~</Typography>
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
    { field: 'comments', headerName: 'Reason/Comments', width: 250, sortable: false }, // Changed headerName
    {
      field: 'actions',
      headerName: 'Withdraw',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="withdraw work from home request" // Updated aria-label
          onClick={() => console.log('Withdraw WFH request:', params.id)} // Placeholder action
          disabled={params.row.status !== 'Pending'}
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
                <InputLabel id="request-type-filter-label">Request Type</InputLabel> {/* Changed label */}
                <Select
                  labelId="request-type-filter-label"
                  label="Request Type" // Changed label
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  aria-label="Filter by request type" // Updated aria-label
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="full_week">Full Week</MenuItem>
                  <MenuItem value="partial_week">Partial Week</MenuItem>
                  <MenuItem value="specific_days">Specific Days</MenuItem>
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
            <Grid item xs />
          </Grid>
        </Paper>

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
            {/* Removed "On Duty" switch as it's less relevant for WFH requests */}
            <Button
              variant="outlined"
              startIcon={<InfoOutlinedIcon />} // Changed icon
              aria-label="View work from home policy"
              size="medium"
            >
              WFH Policy
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              aria-label="Create new work from home request" // Updated aria-label
              size="medium"
            >
              New Request
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, display: 'none' }}> {/* Title can be part of a page header component */}
          Work From Home Requests List
        </Typography>

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={workFromHomeRequestsData} // Changed data source
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkFromHomeRequestsPage;
