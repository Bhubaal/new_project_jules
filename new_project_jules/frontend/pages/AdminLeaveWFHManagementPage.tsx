import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Grid, Paper, Button, SelectChangeEvent, Modal,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  List, ListItem, ListItemText, IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for Add User
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon for Delete User
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

  // State for Create User Modal
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_active: true, // Default to true
    is_superuser: false, // Default to false
  });
  const [createUserError, setCreateUserError] = useState<string | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  // State for Delete User Confirmation Dialog
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<boolean>(false);


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
  // TODO: Implement Delete confirmation and logic for leaves/wfh


  // --- User Management Modal Handlers ---
  const handleOpenCreateUserModal = () => {
    setNewUserData({ // Reset form
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_active: true,
      is_superuser: false,
    });
    setCreateUserError(null);
    setCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setCreateUserModalOpen(false);
  };

  const handleCreateUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateUserSubmit = async () => {
    if (!newUserData.email || !newUserData.password) {
      setCreateUserError("Email and password are required.");
      return;
    }
    setCreatingUser(true);
    setCreateUserError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to create user: ${response.statusText}`);
      }

      const createdUser: User = await response.json();

      // Refresh user list
      setUsers(prevUsers => [...prevUsers, createdUser].sort((a, b) => a.id - b.id)); // Add and sort
      handleCloseCreateUserModal();

    } catch (e) {
      setCreateUserError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreatingUser(false);
    }
  };

  const handleOpenDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteUserError(null);
    setDeleteUserDialogOpen(true);
  };

  const handleCloseDeleteUserDialog = () => {
    setUserToDelete(null);
    setDeleteUserDialogOpen(false);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) {
      setDeleteUserError("No user selected for deletion.");
      return;
    }
    setDeletingUser(true);
    setDeleteUserError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try to parse error detail from backend
        let errorDetail = `Failed to delete user: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                errorDetail = errorData.detail;
            }
        } catch (e) {
            // Ignore if response is not JSON or other parsing error
        }
        throw new Error(errorDetail);
      }

      // User deleted successfully
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));

      // If the deleted user was the selected user, clear selection and details
      if (selectedUserId === String(userToDelete.id)) {
        setSelectedUserId('');
        setSelectedUserDetails(null);
        setUserLeaves([]);
        setUserWFHs([]);
      }

      handleCloseDeleteUserDialog();

    } catch (e) {
      setDeleteUserError(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingUser(false);
    }
  };
  // --- End User Management Modal Handlers ---


  if (!token) {
    return <Typography color="error">Not authenticated. Please login.</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* User Management Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenCreateUserModal}
              disabled={creatingUser}
            >
              Create User
            </Button>
          </Box>
          {loadingUsers && <CircularProgress />}
          {error && <Typography color="error">Error fetching users: {error}</Typography>}
          {!loadingUsers && users.length === 0 && !error && <Typography>No users found.</Typography>}
          {!loadingUsers && users.length > 0 && (
            <List dense sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteUserDialog(user)} disabled={deletingUser && userToDelete?.id === user.id}>
                      {deletingUser && userToDelete?.id === user.id ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: selectedUserId === String(user.id) ? 'action.selected' : 'transparent',
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    pr: 8, // Ensure space for the delete icon
                  }}
                  onClick={() => handleUserChange({ target: { value: String(user.id) } } as SelectChangeEvent<string>)}
                >
                  <ListItemText
                    primary={`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                    secondary={`ID: ${user.id} | Email: ${user.email}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Manage Employee Leaves & WFH
        </Typography>

        {/* Removed the old user selector dropdown as users are now listed above */}
        {/* {loadingUsers && <CircularProgress />} */}
        {/* {error && <Typography color="error" sx={{ mb: 2 }}>Error: {error}</Typography>} */}

        {/* <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="select-user-label">Select User (Leave/WFH Target)</InputLabel>
          <Select
            labelId="select-user-label"
            id="select-user-leave-wfh"
            value={selectedUserId}
            label="Select User (Leave/WFH Target)"
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
        </FormControl> */}


        {selectedUserDetails && !loadingDetails && (
        <Box sx={{ my: 2, p:2, border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{borderBottom: '1px solid #eee', pb:1, mb:1}}>
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

      {/* Create User Modal */}
      <Dialog open={createUserModalOpen} onClose={handleCloseCreateUserModal}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details for the new user.
          </DialogContentText>
          {createUserError && <Typography color="error" sx={{ mb: 2 }}>{createUserError}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newUserData.email}
            onChange={handleCreateUserChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUserData.password}
            onChange={handleCreateUserChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="first_name"
            label="First Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={newUserData.first_name}
            onChange={handleCreateUserChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="last_name"
            label="Last Name (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={newUserData.last_name}
            onChange={handleCreateUserChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox checked={newUserData.is_active} onChange={handleCreateUserChange} name="is_active" />}
            label="Is Active"
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={<Checkbox checked={newUserData.is_superuser} onChange={handleCreateUserChange} name="is_superuser" />}
            label="Is Superuser (Admin)"
            sx={{ mb: 1, display: 'block' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateUserModal} disabled={creatingUser}>Cancel</Button>
          <Button onClick={handleCreateUserSubmit} variant="contained" disabled={creatingUser}>
            {creatingUser ? <CircularProgress size={24} /> : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteUserDialogOpen}
        onClose={handleCloseDeleteUserDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm User Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete user {userToDelete?.email} (ID: {userToDelete?.id})? This action cannot be undone.
          </DialogContentText>
          {deleteUserError && <Typography color="error" sx={{ mt: 2 }}>{deleteUserError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteUserDialog} disabled={deletingUser}>Cancel</Button>
          <Button onClick={handleDeleteUserConfirm} color="error" variant="contained" autoFocus disabled={deletingUser}>
            {deletingUser ? <CircularProgress size={24} /> : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  </LocalizationProvider>
  );
}
