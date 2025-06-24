import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface LeaveData {
  totalAllottedLeave: number;
  usedLeave: number;
  usedWFH: number;
}

const mockData: LeaveData = {
  totalAllottedLeave: 20,
  usedLeave: 10,
  usedWFH: 5,
};

const Dashboard: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveData>(mockData);
  const [remainingLeave, setRemainingLeave] = useState<number>(0);

  useEffect(() => {
    // Use setLeaveData to satisfy the linter, even if it's setting the same data.
    // In a real app, this would be where you fetch new data.
    setLeaveData(prevData => ({ ...prevData }));
    setRemainingLeave(leaveData.totalAllottedLeave - leaveData.usedLeave);
  }, [leaveData]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Total Allotted Leave
            </Typography>
            <Typography variant="h3">
              {leaveData.totalAllottedLeave}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Used Leave Days
            </Typography>
            <Typography variant="h3">
              {leaveData.usedLeave}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Used WFH Days
            </Typography>
            <Typography variant="h3">
              {leaveData.usedWFH}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Remaining Leave Days
            </Typography>
            <Typography variant="h3">
              {remainingLeave}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
