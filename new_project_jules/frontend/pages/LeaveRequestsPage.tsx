import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Select, MenuItem, IconButton, InputLabel, FormControl, Paper, Button, Switch, FormGroup, FormControlLabel, CircularProgress
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import SyncProblemIcon from '@mui/icons-material/SyncProblem'; // Example for a tilde icon, or use Typography
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

// Define an interface for the structure of a leave request from the API
interface LeaveRequest {
  id: number;
  user_id: number; // Assuming the API returns user_id
  user_name?: string; // Optional: if you fetch user details separately or join in backend
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string | null;
  // Add any other relevant fields from your API response
}

// Define an interface for the props of the DataGrid rows
interface LeaveRequestRow extends GridRowsProp {
  id: number;
  user: string; // For display - might be user_name or a formatted string
  leaveType: string;
  days: number; // Calculated or from API
  fromDate: string; // Formatted date
  toDate: string;   // Formatted date
  status: string;
  comments: string | null;
}


const LeaveRequestsPage: React.FC = () => {
  const [leaveType, setLeaveType] = useState('');
  const [days, setDays] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [onDuty, setOnDuty] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [requestCount, setRequestCount] = useState<number>(0); // Will be derived from leaveRequests.length

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with your actual API endpoint and authentication
        const response = await fetch('http://localhost:8000/api/v1/leaves'); // Assuming this endpoint returns all relevant leave requests
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LeaveRequest[] = await response.json();

        // Transform API data to the format expected by DataGrid (LeaveRequestRow)
        // This is a simplified transformation. You might need more complex logic,
        // e.g., fetching user names if only user_id is available.
        const formattedData: LeaveRequestRow[] = data.map(req => {
          const startDate = new Date(req.start_date);
          const endDate = new Date(req.end_date);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

          return {
            id: req.id,
            user: `User ${req.user_id}`, // Placeholder, replace with actual user name if available
            leaveType: req.leave_type,
            days: diffDays,
            fromDate: startDate.toLocaleDateString(),
            toDate: endDate.toLocaleDateString(),
            status: req.status,
            comments: req.reason || '-',
          };
        });

        setLeaveRequests(formattedData);
        // setRequestCount(formattedData.length);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error("Failed to fetch leave requests:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);


  const handleOnDutyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnDuty(event.target.checked);
  };

  const columns: GridColDef<LeaveRequestRow>[] = [
    { field: 'user', headerName: 'Employee', width: 180 },
    { field: 'leaveType', headerName: 'Leave Type', width: 150 },
    { field: 'days', headerName: 'Day(s)', type: 'number', width: 90 },
    {
      field: 'dateRange',
      headerName: 'Date',
      width: 230,
      valueGetter: (_value, row) => `${row.fromDate} ~ ${row.toDate}`, // Use valueGetter for combined field
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Leave Requests...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Failed to load leave requests.</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

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
              {leaveRequests.length} requests
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

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={leaveRequests}
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
