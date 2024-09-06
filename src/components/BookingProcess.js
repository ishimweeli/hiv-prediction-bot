import React, { useState } from 'react';
import axios from 'axios';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Box,
  useMediaQuery,
  useTheme,
  MobileStepper,
  Snackbar
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const API_URL = process.env.REACT_APP_API_URL;

const BookingProcess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhoneNumber, setClientPhoneNumber] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLocationServiceSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/profile/stylists`, {
        params: { location, service },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStylists(response.data);
      handleNext();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch stylists. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
    console.log('Stylist selected: ', stylist)
    handleNext();
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        clientName,
        clientEmail,
        clientPhoneNumber,
        stylist: { id: selectedStylist.user.id },
        bookingTime,
        service,
        location,
        status: 'PENDING'
      };
     
      const response = await axios.post(`${API_URL}/api/booking`, bookingData, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(bookingData)
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        setSnackbar({ open: true, message: 'Booking successful!', severity: 'success' });
        handleNext();
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Booking failed. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieveBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/booking/client`, {
        params: { email: clientEmail },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(response.data);
      setBookingDialogOpen(true);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to retrieve bookings. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button 
              onClick={handleLocationServiceSubmit} 
              variant="contained" 
              color="primary"
              disabled={!location || !service || loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Find Stylists'}
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ width: '100%' }}>
            {stylists.map((stylist) => (
              <Card key={stylist.id} sx={{ mb: 2, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{`${stylist.firstName} ${stylist.lastName}`}</Typography>
                  <Typography>Phone: {stylist.phoneNumber}</Typography>
                  <Button 
                    onClick={() => handleStylistSelect(stylist)} 
                    variant="outlined" 
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Your Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Your Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Your Phone Number"
              value={clientPhoneNumber}
              onChange={(e) => setClientPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Booking Time"
              type="datetime-local"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <Button 
              onClick={handleBookingSubmit} 
              variant="contained" 
              color="primary"
              disabled={!clientName || !clientEmail || !clientPhoneNumber || !bookingTime || loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Book Now'}
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Booking Confirmed!</Typography>
            <Button 
              onClick={() => setActiveStep(0)} 
              variant="contained" 
              color="primary"
              fullWidth
            >
              Make Another Booking
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 2, px: isMobile ? 1 : 2 }}>
        {isMobile ? (
          <MobileStepper
            variant="dots"
            steps={4}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1, mb: 2 }}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === 3}>
                Next
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
            }
          />
        ) : (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Select Location and Service</StepLabel>
            </Step>
            <Step>
              <StepLabel>Choose a Stylist</StepLabel>
            </Step>
            <Step>
              <StepLabel>Book Appointment</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmation</StepLabel>
            </Step>
          </Stepper>
        )}
        <Box sx={{ mb: 4, width: '100%' }}>
          {renderStep(activeStep)}
        </Box>
        {!isMobile && activeStep > 0 && (
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          </Box>
        )}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
          <TextField
            label="Enter your email to retrieve bookings"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            fullWidth
            sx={{ mb: isMobile ? 2 : 0, mr: isMobile ? 0 : 2 }}
          />
          <Button 
            onClick={handleRetrieveBookings} 
            variant="outlined"
            disabled={!clientEmail || loading}
            fullWidth={isMobile}
          >
            {loading ? <CircularProgress size={24} /> : 'View My Bookings'}
          </Button>
        </Box>
        <Dialog 
          open={bookingDialogOpen} 
          onClose={() => setBookingDialogOpen(false)}
          fullScreen={isMobile}
        >
          <DialogTitle>Your Bookings</DialogTitle>
          <DialogContent>
            {bookings.map((booking) => (
              <Card key={booking.id} sx={{ mb: 2, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{booking.service}</Typography>
                  <Typography>{new Date(booking.bookingTime).toLocaleString()}</Typography>
                  <Typography>Status: {booking.status}</Typography>
                </CardContent>
              </Card>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)} color="primary" fullWidth={isMobile}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingProcess;