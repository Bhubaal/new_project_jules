import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import MetricCard from '../src/MetricCard'; // Adjusted path
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Sample Data for Detailed Leave Table (from leave.tsx)
const leaveHistoryData: GridRowsProp = [
  { id: 1, leaveType: 'Annual Leave', startDate: '2024-03-10', endDate: '2024-03-12', status: 'Approved', reason: 'Vacation' },
  { id: 2, leaveType: 'Sick Leave', startDate: '2024-04-01', endDate: '2024-04-01', status: 'Approved', reason: 'Flu' },
  { id: 3, leaveType: 'Casual Leave', startDate: '2024-05-05', endDate: '2024-05-05', status: 'Pending', reason: 'Personal Errand' },
  { id: 4, leaveType: 'Annual Leave', startDate: '2024-06-15', endDate: '2024-06-20', status: 'Approved', reason: 'Family Trip' },
  { id: 5, leaveType: 'Unpaid Leave', startDate: '2024-07-01', endDate: '2024-07-05', status: 'Rejected', reason: 'Extended Travel - Not enough balance' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'leaveType', headerName: 'Leave Type', width: 150 },
  { field: 'startDate', headerName: 'Start Date', width: 120, type: 'date' },
  { field: 'endDate', headerName: 'End Date', width: 120, type: 'date' },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'reason', headerName: 'Reason', width: 250, sortable: false },
];

interface LeaveBalanceData {
  totalAllottedLeave: number;
  usedLeave: number;
}

const mockLeaveBalance: LeaveBalanceData = {
  totalAllottedLeave: 25,
  usedLeave: 12,
};

export default function LeavesPage() {
  const [leaveBalance, _setLeaveBalance] = useState<LeaveBalanceData>(mockLeaveBalance);
  const [remainingLeave, setRemainingLeave] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRemainingLeave(leaveBalance.totalAllottedLeave - leaveBalance.usedLeave);
      setLoading(false);
    }, 500); // Simulate loading
    return () => clearTimeout(timer);
  }, [leaveBalance]);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">This page is no longer available.</Typography>
    </Box>
  );
}
