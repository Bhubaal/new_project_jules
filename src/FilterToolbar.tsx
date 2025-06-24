import React, { useState, useEffect } from 'react'; // Removed useCallback
import { Box, TextField, Paper, Grid, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Chip } from '@mui/material';
import { LocalizationProvider, DateRangePicker, DateRange } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Trying generic AdapterDateFns from non-pro
import { SelectChangeEvent } from '@mui/material/Select';

// --- Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Mock User Data for Multi-select ---
const mockUsers = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

// --- Component Props (Placeholder for React Query integration) ---
interface FilterToolbarProps {
  onFiltersChange?: (filters: any) => void; // Callback to parent with filter state
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const FilterToolbar: React.FC<FilterToolbarProps> = ({ onFiltersChange }) => {
  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce

  // --- Handlers ---
  const handleDateRangeChange = (newDateRange: DateRange<Date>) => {
    setDateRange(newDateRange);
  };

  const handleUserChange = (event: SelectChangeEvent<typeof selectedUsers>) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // --- Effect to call onFiltersChange when debounced search or other filters change ---
  useEffect(() => {
    // This is where you would typically call a function to refetch data based on filters
    // For now, we'll just log it or pass it to a parent component
    const currentFilters = {
      dateRange,
      users: selectedUsers,
      search: debouncedSearchTerm,
    };
    if (onFiltersChange) {
      onFiltersChange(currentFilters);
    }
    // console.log('Filters updated:', currentFilters); // For debugging
  }, [dateRange, selectedUsers, debouncedSearchTerm, onFiltersChange]);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="user-multi-select-label">Users</InputLabel>
              <Select
                labelId="user-multi-select-label"
                id="user-multi-select"
                multiple
                value={selectedUsers}
                onChange={handleUserChange}
                input={<OutlinedInput id="select-multiple-chip" label="Users" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {mockUsers.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedUsers.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search dashboard content..."
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Paper>
  );
};

export default FilterToolbar;
