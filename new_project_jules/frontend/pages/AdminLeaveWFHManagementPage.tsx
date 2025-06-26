import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Grid, Paper, Button, SelectChangeEvent
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// TODO: Define types for User, Leave, WFH based on backend schemas
interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface Leave {
  id: number;
  from_date: string;
  to_date: string;
  leave_type: string;
  status: string;
  comments?: string;
  num_days: number;
  user_id: number;
}

interface WFH {
  id: number;
  from_date: string;
  to_date: string;
  status: string;
  comments?: string;
  num_days: number;
  user_id: number;
}

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming API is on port 8000

const leaveColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'leave_type', headerName: 'Type', width: 130 },
  { field: 'from_date', headerName: 'From', width: 120, type: 'date', valueGetter: params => new Date(params.value) },
  { field: 'to_date', headerName: 'To', width: 120, type: 'date', valueGetter: params => new Date(params.value) },
  { field: 'num_days', headerName: 'Days', width: 90, type: 'number' },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'comments', headerName: 'Comments', width: 200 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        <Button size="small" onClick={() => console.log('Edit leave', params.row)}><EditIcon /></Button>
        <Button size="small" onClick={() => console.log('Delete leave', params.row)}><DeleteIcon /></Button>
      </>
    ),
  },
];

const wfhColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'from_date', headerName: 'From', width: 120, type: 'date', valueGetter: params => new Date(params.value) },
  { field: 'to_date', headerName: 'To', width: 120, type: 'date', valueGetter: params => new Date(params.value) },
  { field: 'num_days', headerName: 'Days', width: 90, type: 'number' },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'comments', headerName: 'Comments', width: 200 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        <Button size="small" onClick={() => console.log('Edit WFH', params.row)}><EditIcon /></Button>
        <Button size="small" onClick={() => console.log('Delete WFH', params.row)}><DeleteIcon /></Button>
      </>
    ),
  },
];


export default function AdminLeaveWFHManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userLeaves, setUserLeaves] = useState<GridRowsProp>([]);
  const [userWFHs, setUserWFHs] = useState<GridRowsProp>([]);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
        const data: User[] = await response.json();
        setUsers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingUsers(false);
      }
    };
    if (token) {
      fetchUsers();
    } else {
      setError("Authentication token not found.");
    }
  }, [token]);

  // Fetch leaves and WFH for selected user
  useEffect(() => {
    if (!selectedUserId || !token) {
      setUserLeaves([]);
      setUserWFHs([]);
      return;
    }

    const fetchUserDetails = async () => {
      setLoadingDetails(true);
      setError(null);
      try {
        // Fetch Leaves
        const leavesResponse = await fetch(`${API_BASE_URL}/admin/users/${selectedUserId}/leaves`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!leavesResponse.ok) throw new Error(`Failed to fetch leaves: ${leavesResponse.statusText}`);
        const leavesData: Leave[] = await leavesResponse.json();
        setUserLeaves(leavesData.map(l => ({ ...l, from_date: new Date(l.from_date), to_date: new Date(l.to_date) })));

        // Fetch WFH
        const wfhResponse = await fetch(`${API_BASE_URL}/admin/users/${selectedUserId}/wfh`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!wfhResponse.ok) throw new Error(`Failed to fetch WFH: ${wfhResponse.statusText}`);
        const wfhData: WFH[] = await wfhResponse.json();
        setUserWFHs(wfhData.map(w => ({ ...w, from_date: new Date(w.from_date), to_date: new Date(w.to_date) })));

      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchUserDetails();
  }, [selectedUserId, token]);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUserId(event.target.value);
  };

  // Placeholder for Add/Edit/Delete Modals and functions
  // TODO: Implement Modals for Add/Edit Leave and WFH
  // TODO: Implement Delete confirmation and logic

  if (!token) {
    return <Typography color="error">Not authenticated. Please login.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin - Manage Employee Leaves & WFH
      </Typography>

      {loadingUsers && <CircularProgress />}
      {error && <Typography color="error" sx={{ mb: 2 }}>Error: {error}</Typography>}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="select-user-label">Select User</InputLabel>
        <Select
          labelId="select-user-label"
          id="select-user"
          value={selectedUserId}
          label="Select User"
          onChange={handleUserChange}
          disabled={loadingUsers || users.length === 0}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={String(user.id)}>
              {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : user.email} ({user.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedUserId && (
        loadingDetails ? <CircularProgress sx={{mt: 2}} /> : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Leave Requests</Typography>
                  <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => console.log("Add Leave for user:", selectedUserId)}>
                    Add Leave
                  </Button>
                </Box>
                <Box sx={{ height: 300, width: '100%' }}>
                  <DataGrid rows={userLeaves} columns={leaveColumns} pageSizeOptions={[5]} autoPageSize />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Work From Home Requests</Typography>
                  <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => console.log("Add WFH for user:", selectedUserId)}>
                    Add WFH
                  </Button>
                </Box>
                <Box sx={{ height: 300, width: '100%' }}>
                  <DataGrid rows={userWFHs} columns={wfhColumns} pageSizeOptions={[5]} autoPageSize />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )
      )}
    </Box>
  );
}
