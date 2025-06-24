import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Paper, Typography, Grid, Drawer, IconButton, Box, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Mock data for charts
const monthlyLeaveData = [
  { name: 'Jan', used: 4, wfh: 2 },
  { name: 'Feb', used: 3, wfh: 5 },
  { name: 'Mar', used: 5, wfh: 3 },
  { name: 'Apr', used: 2, wfh: 4 },
  { name: 'May', used: 6, wfh: 1 },
  { name: 'Jun', used: 4, wfh: 3 },
];

const leaveTypeData = [
  { name: 'Annual Leave', value: 120 },
  { name: 'Sick Leave', value: 60 },
  { name: 'Unpaid Leave', value: 30 },
  { name: 'WFH', value: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for Pie Chart

interface DrillDownData {
  type: string;
  data: any;
}

const ChartSection: React.FC = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const handleBarClick = (data: any) => {
    // data.activePayload[0].payload will give the data of the clicked bar
    if (data && data.activePayload && data.activePayload.length > 0) {
      setDrillDownData({ type: 'Monthly Leave Details', data: data.activePayload[0].payload });
      setDrawerOpen(true);
    }
  };

  const handlePieClick = (data: any) => {
    // data.name and data.value are directly available
    setDrillDownData({ type: 'Leave Type Details', data: { name: data.name, value: data.value } });
    setDrawerOpen(true);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Bar Chart - Monthly Usage */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Usage (Leave vs WFH)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeaveData} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill={theme.palette.primary.main} name="Leave Days" />
                <Bar dataKey="wfh" fill={theme.palette.secondary.main} name="WFH Days" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart - Trend (Example: Leave Taken Over Time) */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Leave Trend
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyLeaveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="used" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} name="Leave Taken" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart - Leave Types Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Leave Types Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  onClick={handlePieClick}
                >
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Drill-down Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 350, p: 2 }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{drillDownData?.type || 'Details'}</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1">
            Detailed information for:
          </Typography>
          {drillDownData && (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: theme.palette.background.default, padding: theme.spacing(1) }}>
              {JSON.stringify(drillDownData.data, null, 2)}
            </pre>
          )}
          {/* More detailed content can be rendered here based on drillDownData.type */}
        </Box>
      </Drawer>
    </>
  );
};

export default ChartSection;
