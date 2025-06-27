import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';

interface LeaveRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// TODO: Fetch leave types from an API or define them statically
const leaveTypes = [
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
  { value: 'OTHER', label: 'Other' },
];

export default function LeaveRequestModal({ open, onClose, onSubmitSuccess }: LeaveRequestModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when modal opens or closes
    if (!open) {
      setStartDate('');
      setEndDate('');
      setLeaveType('');
      setReason('');
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleLeaveTypeChange = (event: SelectChangeEvent<string>) => {
    setLeaveType(event.target.value as string);
  };

  const validateForm = (): boolean => {
    if (!startDate || !endDate || !leaveType) {
      setError('Start Date, End Date, and Leave Type are required.');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start Date cannot be after End Date.');
      return false;
    }
    // Add more specific date validation if needed (e.g., not in the past)
    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API endpoint and authentication
      const response = await fetch('http://localhost:8000/api/v1/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if required
          // 'Authorization': `Bearer ${your_auth_token}`
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          leave_type: leaveType,
          reason: reason,
          // Ensure user_id is handled by the backend based on authentication
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred during submission.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // const result = await response.json(); // Process result if needed
      onSubmitSuccess(); // Call success callback (e.g., to refresh parent list)
      onClose(); // Close modal on success

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during submission.');
      }
      console.error('Failed to submit leave request:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="leave-request-modal-title"
      aria-describedby="leave-request-modal-description"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit} noValidate>
        <Typography id="leave-request-modal-title" variant="h6" component="h2">
          New Leave Request
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

        <TextField
          margin="normal"
          required
          fullWidth
          id="start_date"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={submitting}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="end_date"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={submitting}
        />
        <FormControl fullWidth margin="normal" required disabled={submitting}>
          <InputLabel id="leave-type-label">Leave Type</InputLabel>
          <Select
            labelId="leave-type-label"
            id="leave_type"
            value={leaveType}
            label="Leave Type"
            onChange={handleLeaveTypeChange}
          >
            {leaveTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="reason"
          label="Reason (Optional)"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={submitting}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
