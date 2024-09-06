import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { FaCalendarCheck, FaMoneyBillWave, FaComments, FaStar } from 'react-icons/fa';

const StatCard = ({ icon, title, value }) => (
  <Card>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item xs>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Home = () => {
  // These would typically come from an API or state management
  const stats = {
    bookings: 12,
    revenue: '$1,234',
    comments: 25,
    rating: 4.8
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<FaCalendarCheck size={40} color="#4CAF50" />}
            title="Total Bookings"
            value={stats.bookings}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<FaMoneyBillWave size={40} color="#2196F3" />}
            title="Total Revenue"
            value={stats.revenue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<FaComments size={40} color="#FF9800" />}
            title="Comments"
            value={stats.comments}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<FaStar size={40} color="#FFC107" />}
            title="Average Rating"
            value={stats.rating}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;