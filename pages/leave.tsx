import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

// Sample Data for Detailed Leave Table
const leaveData: GridRowsProp = [
  { id: 1, leaveType: 'Annual Leave', startDate: '2024-03-10', endDate: '2024-03-12', status: 'Approved', reason: 'Vacation' },
  { id: 2, leaveType: 'Sick Leave', startDate: '2024-04-01', endDate: '2024-04-01', status: 'Approved', reason: 'Flu' },
  { id: 3, leaveType: 'Casual Leave', startDate: '2024-05-05', endDate: '2024-05-05', status: 'Pending', reason: 'Personal Errand' },
  { id: 4, leaveType: 'Annual Leave', startDate: '2024-06-15', endDate: '2024-06-20', status: 'Approved', reason: 'Family Trip' },
  { id: 5, leaveType: 'Unpaid Leave', startDate: '2024-07-01', endDate: '2024-07-05', status: 'Rejected', reason: 'Extended Travel - Not enough balance' },
  { id: 6, leaveType: 'Sick Leave', startDate: '2024-08-10', endDate: '2024-08-11', status: 'Approved', reason: 'Medical Procedure' },
  { id: 7, leaveType: 'Annual Leave', startDate: '2024-09-01', endDate: '2024-09-03', status: 'Pending', reason: 'Holiday' },
  { id: 8, leaveType: 'Casual Leave', startDate: '2024-10-20', endDate: '2024-10-20', status: 'Approved', reason: 'Personal Appointment' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'leaveType', headerName: 'Leave Type', width: 150, editable: true },
  { field: 'startDate', headerName: 'Start Date', width: 120, type: 'date', editable: true },
  { field: 'endDate', headerName: 'End Date', width: 120, type: 'date', editable: true },
  { field: 'status', headerName: 'Status', width: 120, editable: true },
  { field: 'reason', headerName: 'Reason', width: 250, editable: true, sortable: false },
];

export default function LeavePage() {
  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Leave Requests</Typography>
      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={leaveData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
