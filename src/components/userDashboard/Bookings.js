import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  CircularProgress,
  Snackbar
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/booking/stylist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleApprove = async (bookingId) => {
    try {
      const response = await axios.put(`${API_URL}/api/booking/${bookingId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? response.data : booking
      ));
      setSnackbar({ open: true, message: 'Booking approved successfully' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to approve booking' });
      console.error('Error approving booking:', err);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const response = await axios.put(`${API_URL}/api/booking/${bookingId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? response.data : booking
      ));
      setSnackbar({ open: true, message: 'Booking rejected successfully' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to reject booking' });
      console.error('Error rejecting booking:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Booking Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.clientName}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{new Date(booking.bookingTime).toLocaleString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDetails(booking)}>View Details</Button>
                  {booking.status === 'PENDING' && (
                    <>
                      <Button onClick={() => handleApprove(booking.id)} color="primary">Approve</Button>
                      <Button onClick={() => handleReject(booking.id)} color="secondary">Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={detailsOpen} onClose={handleCloseDetails}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Client Information</Typography>
                <Typography>Name: {selectedBooking.clientName}</Typography>
                <Typography>Email: {selectedBooking.clientEmail}</Typography>
                <Typography>Phone: {selectedBooking.clientPhoneNumber}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Booking Information</Typography>
                <Typography>Service: {selectedBooking.service}</Typography>
                <Typography>Date & Time: {new Date(selectedBooking.bookingTime).toLocaleString()}</Typography>
                <Typography>Location: {selectedBooking.location}</Typography>
                <Typography>Street Number: {selectedBooking.streetNumber}</Typography>
                <Typography>Status: {selectedBooking.status}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Stylist Information</Typography>
                <Typography>Email: {selectedBooking.stylist.email}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </div>
  );
};

export default Bookings;