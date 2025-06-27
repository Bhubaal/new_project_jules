import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Grid, Paper, Button, SelectChangeEvent, Modal,
  TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// TODO: Define types for User, Leave, WFH based on backend schemas
interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  granted_additional_days?: number; // Added field
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

  // State for the selected user object to access its properties like granted_additional_days
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);


  const [addLeaveModalOpen, setAddLeaveModalOpen] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState({
    leave_type: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
    reason: '',
  });

  // State for Adjust Additional Days Modal
  const [adjustDaysModalOpen, setAdjustDaysModalOpen] = useState(false);
  const [additionalDaysToGrant, setAdditionalDaysToGrant] = useState<number | string>('');
  const [adjustDaysError, setAdjustDaysError] = useState<string | null>(null);
  const [adjustingDays, setAdjustingDays] = useState<boolean>(false);


  const token = localStorage.getItem('accessToken');

  // Function to fetch a single user's details (might be needed if /users doesn't return all fields)
  const fetchUserDetails = async (userId: string) => {
    if (!token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }
      const userData: User = await response.json();
      setSelectedUserDetails(userData);
      return userData;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  };


  const fetchUserLeaves = async (userId: string) => {
    if (!token || !userId) return;
    setLoadingDetails(true);
    try {
      const leavesResponse = await fetch(`${API_BASE_URL}/admin/users/${userId}/leaves`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!leavesResponse.ok) throw new Error(`Failed to fetch leaves: ${leavesResponse.statusText}`);
      const leavesData: Leave[] = await leavesResponse.json();
      setUserLeaves(leavesData.map(l => ({ ...l, from_date: new Date(l.from_date), to_date: new Date(l.to_date) })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchUserWFHs = async (userId: string) => {
    if (!token || !userId) return;
    // setLoadingDetails(true); // Assuming this is handled by a combined loading state or called after leaves
    try {
      const wfhResponse = await fetch(`${API_BASE_URL}/admin/users/${userId}/wfh`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!wfhResponse.ok) throw new Error(`Failed to fetch WFH: ${wfhResponse.statusText}`);
      const wfhData: WFH[] = await wfhResponse.json();
      setUserWFHs(wfhData.map(w => ({ ...w, from_date: new Date(w.from_date), to_date: new Date(w.to_date) })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      // setLoadingDetails(false);
    }
  };


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
      setSelectedUserDetails(null); // Clear selected user details
      return;
    }
    setLoadingDetails(true); // Set loading before starting fetches
    setError(null); // Clear previous errors

    // Fetch user details along with leaves and WFH
    const userDetailsPromise = fetchUserDetails(selectedUserId);
    const leavesPromise = fetchUserLeaves(selectedUserId);
    const wfhPromise = fetchUserWFHs(selectedUserId);

    Promise.all([userDetailsPromise, leavesPromise, wfhPromise])
      .catch(e => {
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        setLoadingDetails(false); // Clear loading after all promises settle
      });

  }, [selectedUserId, token]);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const newUserId = event.target.value;
    setSelectedUserId(newUserId);
    if (newUserId) {
      // Option 1: Fetch user details immediately on change
      // fetchUserDetails(newUserId);
      // Option 2: Or rely on the useEffect above, which is cleaner.
      // If users array already contains full details, find and set it here.
      const user = users.find(u => u.id.toString() === newUserId);
      setSelectedUserDetails(user || null);
    } else {
      setSelectedUserDetails(null);
    }
  };

  const handleOpenAdjustDaysModal = () => {
    if (!selectedUserDetails) return;
    setAdditionalDaysToGrant(selectedUserDetails.granted_additional_days || 0);
    setAdjustDaysError(null);
    setAdjustDaysModalOpen(true);
  };

  const handleCloseAdjustDaysModal = () => {
    setAdjustDaysModalOpen(false);
  };

  const handleAdjustDaysSubmit = async () => {
    if (selectedUserId == null || additionalDaysToGrant === '' || isNaN(Number(additionalDaysToGrant))) {
      setAdjustDaysError("Please enter a valid number of days.");
      return;
    }
    setAdjustingDays(true);
    setAdjustDaysError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUserId}/adjust_leave_days`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ granted_additional_days: Number(additionalDaysToGrant) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to adjust days: ${response.statusText}`);
      }
      const updatedUser: User = await response.json();
      setSelectedUserDetails(updatedUser); // Update selected user details with new data
      // Optionally, update the user in the main 'users' list as well if needed elsewhere
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));


      handleCloseAdjustDaysModal();
    } catch (e) {
      setAdjustDaysError(e instanceof Error ? e.message : String(e));
    } finally {
      setAdjustingDays(false);
    }
  };


  const handleOpenAddLeaveModal = () => {
    setNewLeaveData({ // Reset form
      leave_type: '',
      start_date: null,
      end_date: null,
      reason: '',
    });
    setSubmissionError(null); // Clear previous submission errors
    setAddLeaveModalOpen(true);
  };

  const handleCloseAddLeaveModal = () => {
    setAddLeaveModalOpen(false);
  };

  const handleAddLeaveChange = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewLeaveData(prev => ({ ...prev, [name!]: value }));
  };

  const handleAddLeaveDateChange = (name: 'start_date' | 'end_date', date: Date | null) => {
    setNewLeaveData(prev => ({ ...prev, [name]: date }));
  };

  const handleAddLeaveSubmit = async () => {
    if (!selectedUserId || !token || !newLeaveData.start_date || !newLeaveData.end_date || !newLeaveData.leave_type) {
      setSubmissionError("User, leave type, start date, and end date are required.");
      return;
    }
    setSubmissionError(null);

    // Format dates to YYYY-MM-DD string
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const payload = {
      user_id: parseInt(selectedUserId),
      leave_type: newLeaveData.leave_type,
      start_date: formatDate(newLeaveData.start_date),
      end_date: formatDate(newLeaveData.end_date),
      reason: newLeaveData.reason || null, // Ensure reason is null if empty, not ""
      status: "pending", // Default status
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to add leave: ${response.statusText}`);
      }

      // Success
      handleCloseAddLeaveModal();
      await fetchUserLeaves(selectedUserId); // Refresh leaves for the current user
    } catch (e) {
      setSubmissionError(e instanceof Error ? e.message : String(e));
    }
  };


  // TODO: Implement Modals for Edit Leave and WFH
  // TODO: Implement Delete confirmation and logic

  if (!token) {
    return <Typography color="error">Not authenticated. Please login.</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

      {selectedUserDetails && !loadingDetails && (
        <Box sx={{ my: 2, p:2, border: '1px dashed grey', borderRadius: '4px' }}>
          <Typography variant="h6">
            User: {selectedUserDetails.first_name || selectedUserDetails.last_name ? `${selectedUserDetails.first_name || ''} ${selectedUserDetails.last_name || ''}`.trim() : selectedUserDetails.email}
          </Typography>
          <Typography variant="body1">
            Current Granted Additional Days: <strong>{selectedUserDetails.granted_additional_days !== undefined ? selectedUserDetails.granted_additional_days : 'N/A'}</strong>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenAdjustDaysModal}
            sx={{mt: 1}}
            disabled={adjustingDays}
          >
            {adjustingDays ? <CircularProgress size={20}/> : "Adjust Additional Days"}
          </Button>
        </Box>
      )}

      {selectedUserId && (
        loadingDetails ? <CircularProgress sx={{mt: 2}} /> : (
          <Grid container spacing={3} sx={{mt: selectedUserDetails ? 0 : 2 } /* Adjust margin if details box is shown */}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Leave Requests</Typography>
                  <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenAddLeaveModal} disabled={!selectedUserId}>
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

      {/* Add Leave Modal */}
      <Dialog open={addLeaveModalOpen} onClose={handleCloseAddLeaveModal}>
        <DialogTitle>Add New Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Select leave type, dates, and provide a reason if necessary for user ID: {selectedUserId}.
          </DialogContentText>
          {submissionError && <Typography color="error" sx={{ mb: 2 }}>{submissionError}</Typography>}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="leave-type-label">Leave Type</InputLabel>
            <Select
              labelId="leave-type-label"
              name="leave_type"
              value={newLeaveData.leave_type}
              onChange={handleAddLeaveChange}
              label="Leave Type"
            >
              {/* TODO: Populate these from a central config or API if they can change */}
              <MenuItem value="annual">Annual Leave</MenuItem>
              <MenuItem value="sick">Sick Leave</MenuItem>
              <MenuItem value="casual">Casual Leave</MenuItem>
              <MenuItem value="unpaid">Unpaid Leave</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Start Date"
            value={newLeaveData.start_date}
            onChange={(date) => handleAddLeaveDateChange('start_date', date)}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
          />
          <DatePicker
            label="End Date"
            value={newLeaveData.end_date}
            onChange={(date) => handleAddLeaveDateChange('end_date', date)}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
            minDate={newLeaveData.start_date || undefined}
          />
          <TextField
            name="reason"
            label="Reason (Optional)"
            multiline
            rows={3}
            fullWidth
            value={newLeaveData.reason}
            onChange={handleAddLeaveChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddLeaveModal}>Cancel</Button>
          <Button onClick={handleAddLeaveSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Additional Days Modal */}
      <Dialog open={adjustDaysModalOpen} onClose={handleCloseAdjustDaysModal}>
        <DialogTitle>Adjust Additional Leave Days</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Set the total number of additional leave days for {selectedUserDetails?.email || 'this user'}.
            This value will directly set their `granted_additional_days`.
          </DialogContentText>
          {adjustDaysError && <Typography color="error" sx={{ mb: 2 }}>{adjustDaysError}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            id="additionalDays"
            label="Total Additional Days"
            type="number"
            fullWidth
            variant="standard"
            value={additionalDaysToGrant}
            onChange={(e) => setAdditionalDaysToGrant(e.target.value)}
            InputProps={{
                inputProps: {
                    min: 0
                }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdjustDaysModal} disabled={adjustingDays}>Cancel</Button>
          <Button onClick={handleAdjustDaysSubmit} variant="contained" disabled={adjustingDays}>
            {adjustingDays ? <CircularProgress size={24} /> : "Set Days"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  </LocalizationProvider>
  );
}
