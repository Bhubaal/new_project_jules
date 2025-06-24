import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Grid, Typography, CircularProgress, Paper } from '@mui/material'; // Removed Box
import MetricCard from './MetricCard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FilterToolbar from './FilterToolbar';

// Lazy load sections
const ChartSection = React.lazy(() => import('./ChartSection'));
const DataTable = React.lazy(() => import('./DataTable'));

interface LeaveData {
  totalAllottedLeave: number;
  usedLeave: number;
  usedWFH: number;
}

const mockData: LeaveData = {
  totalAllottedLeave: 25,
  usedLeave: 12,
  usedWFH: 8,
};

const Dashboard: React.FC = () => {
  const [leaveData, _setLeaveData] = useState<LeaveData>(mockData); // Prefixed setLeaveData
  const [remainingLeave, setRemainingLeave] = useState<number>(0);
  const [metricCardsLoading, setMetricCardsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setRemainingLeave(leaveData.totalAllottedLeave - leaveData.usedLeave);
      setMetricCardsLoading(false);
    }, 1000); // Reduced loading time for cards
    return () => clearTimeout(timer);
  }, [leaveData]);

  const handleFilterChange = useCallback((newFilters: any) => {
    console.log("Dashboard received filters:", newFilters);
    setFilters(newFilters);
    // Placeholder: Trigger data fetching based on newFilters
  }, []);

  const SuspenseFallback = (
    <Paper sx={{p:2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, width: '100%', my: 2}}>
      <CircularProgress />
      <Typography sx={{ml: 2}}>Loading section...</Typography>
    </Paper>
  );

  return (
    <>
      <FilterToolbar onFiltersChange={handleFilterChange} />

      <Grid container spacing={3} sx={{ mt: 0, mb: 3 }}> {/* Adjusted mt for tighter spacing with toolbar */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Allotted Leave"
            value={`${leaveData.totalAllottedLeave} days`}
            icon={<EventAvailableIcon />}
            color="primary"
            loading={metricCardsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Used Leave Days"
            value={`${leaveData.usedLeave} days`}
            icon={<EventBusyIcon />}
            color="warning"
            loading={metricCardsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Remaining Leave"
            value={`${remainingLeave} days`}
            icon={<HourglassEmptyIcon />}
            color="success"
            loading={metricCardsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Used WFH Days"
            value={`${leaveData.usedWFH} days`}
            icon={<HomeWorkIcon />}
            color="info"
            loading={metricCardsLoading}
          />
        </Grid>
      </Grid>

      <Suspense fallback={SuspenseFallback}>
        <ChartSection />
      </Suspense>

      <Typography variant="h5" sx={{mt: 4, mb: 2}}>
        Detailed Records
      </Typography>
      <Suspense fallback={SuspenseFallback}>
        <DataTable />
      </Suspense>

      {/* Section to display current filters for debugging/demonstration */}
      { Object.keys(filters).length > 0 && (
          <Paper sx={{p:2, mt: 3, background: theme => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100] }}>
            <Typography variant="subtitle1">Current Active Filters:</Typography>
            <pre style={{fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
                {JSON.stringify(filters, null, 2)}
            </pre>
          </Paper>
        )
      }
    </>
  );
};

export default Dashboard;
