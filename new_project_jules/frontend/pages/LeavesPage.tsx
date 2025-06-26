import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import MetricCard from '../src/MetricCard'; // Adjusted path
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// TODO: Define appropriate types for API response
interface LeaveData {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string | null;
  // Add other fields as per API response
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'leave_type', headerName: 'Leave Type', width: 150 },
  { field: 'start_date', headerName: 'Start Date', width: 120, type: 'date' },
  { field: 'end_date', headerName: 'End Date', width: 120, type: 'date' },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'reason', headerName: 'Reason', width: 250, sortable: false },
];

interface LeaveBalanceData {
  totalAllottedLeave: number; // This might need to be fetched or calculated differently
  usedLeave: number;
}

export default function LeavesPage() {
  const [leaveHistory, setLeaveHistory] = useState<GridRowsProp>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceData>({ totalAllottedLeave: 20, usedLeave: 0 }); // Initial default or fetched
  const [remainingLeave, setRemainingLeave] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API endpoint and authentication
        const response = await fetch('http://localhost:8000/api/v1/leaves');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LeaveData[] = await response.json();

        // Transform API data to GridRowsProp
        const formattedData = data.map(item => ({
          id: item.id,
          leave_type: item.leave_type,
          start_date: new Date(item.start_date), // Format date if necessary
          end_date: new Date(item.end_date),     // Format date if necessary
          status: item.status,
          reason: item.reason || '-',
        }));
        setLeaveHistory(formattedData);

        // Calculate used leave - this is a simplified example
        // API might provide this directly or total allotted leave
        const used = data.filter(l => l.status === 'Approved').length; // Example calculation
        // Assuming totalAllottedLeave is fixed or fetched from another source
        // For now, keeping a placeholder value for totalAllottedLeave
        const currentBalance: LeaveBalanceData = { totalAllottedLeave: 25, usedLeave: used };
        setLeaveBalance(currentBalance);
        setRemainingLeave(currentBalance.totalAllottedLeave - currentBalance.usedLeave);

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
        // Keep dummy data or show error message
        console.error("Failed to fetch leave data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  const handleAddLeaveRequest = () => {
    // Placeholder for navigation or modal popup
    alert('Navigate to Add Leave Request Page/Modal');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Leave Information...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Failed to load leave information.</Typography>
        <Typography>{error}</Typography>
        {/* Optionally, add a retry button */}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Leaves
      </Typography>

      {/* Leave Balance Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <MetricCard title="Total Allotted" value={leaveBalance.totalAllottedLeave} icon={<EventAvailableIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard title="Used" value={leaveBalance.usedLeave} icon={<EventBusyIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard title="Remaining" value={remainingLeave} icon={<HourglassEmptyIcon />} />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddLeaveRequest}
          sx={{backgroundColor: '#004d40', '&:hover': {backgroundColor: '#00382e'}}}
        >
          Request Leave
        </Button>
      </Box>

      {/* Leave History Table */}
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={leaveHistory}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
