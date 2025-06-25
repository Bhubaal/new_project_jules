import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

// 1. Define the data structure for work-from-home requests
interface WorkFromHomeEntry {
  id: number;
  employeeName: string;
  date: string; // Using string for simplicity, can be Date object
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Create dummy data
const dummyWfhRequests: WorkFromHomeEntry[] = [
  { id: 1, employeeName: 'Alice Wonderland', date: '2024-07-15', reason: 'Doctor Appointment', status: 'Approved' },
  { id: 2, employeeName: 'Bob The Builder', date: '2024-07-16', reason: 'Personal Errand', status: 'Pending' },
  { id: 3, employeeName: 'Charlie Brown', date: '2024-07-16', reason: 'Focus Work', status: 'Approved' },
  { id: 4, employeeName: 'Diana Prince', date: '2024-07-17', reason: 'Package Delivery', status: 'Rejected' },
  { id: 5, employeeName: 'Edward Scissorhands', date: '2024-07-18', reason: 'Home Repair', status: 'Pending' },
  { id: 6, employeeName: 'Fiona Gallagher', date: '2024-07-19', reason: 'Family Matter', status: 'Approved' },
];

// Define columns for the DataGrid
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'employeeName', headerName: 'Employee Name', width: 200, editable: true },
  { field: 'date', headerName: 'Date', width: 150, editable: true },
  { field: 'reason', headerName: 'Reason', width: 250, editable: true },
  { field: 'status', headerName: 'Status', width: 120, editable: true },
];

export default function WorkFromHomePage() {
  const rows: GridRowsProp = dummyWfhRequests;

  return (
    <Box sx={{ height: 'auto', width: '100%', mt: 3 }}>
      <h1>Work From Home Requests</h1>
      {/* Navigation is handled by DashboardLayout */}
      <Box sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
