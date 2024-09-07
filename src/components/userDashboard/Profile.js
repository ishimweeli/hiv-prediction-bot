import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cities from 'list-of-us-cities';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = process.env.REACT_APP_API_URL;

const defaultProfile = {
  id: '',
  user: {
    id: '',
    email: '',
    password: '',
    role: '',
    active: true
  },
  firstName: '',
  lastName: '',
  age: 0,
  phoneNumber: '',
  country: '',
  locations: [],
  services: [],
  streetNumber: ''
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const [newService, setNewService] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile({ ...defaultProfile, ...response.data });
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', err);
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const data = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        locations: profile.locations,
        services: profile.services,
        streetNumber: profile.streetNumber,
      };
      await axios.put(`${API_URL}/api/profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (event) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleCancelEdit = (event) => {
    event.preventDefault();
    setIsEditing(false);
    fetchProfile();
  };

  const handleAddLocation = () => {
    if (newLocation && !profile.locations.includes(newLocation)) {
      setProfile(prevProfile => ({
        ...prevProfile,
        locations: [...prevProfile.locations, newLocation]
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      locations: prevProfile.locations.filter(loc => loc !== location)
    }));
  };

  const handleAddService = () => {
    if (newService && !profile.services.includes(newService)) {
      setProfile(prevProfile => ({
        ...prevProfile,
        services: [...prevProfile.services, newService]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (service) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      services: prevProfile.services.filter(serv => serv !== service)
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} className="p-6">
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <form onSubmit={isEditing ? handleSubmit : handleEditClick}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.user.email}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={profile.country}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Street Number"
              name="streetNumber"
              value={profile.streetNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Locations</Typography>
            {isEditing ? (
              <>
                <List>
                  {profile.locations.map((location) => (
                    <ListItem key={location}>
                      <ListItemText primary={location} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveLocation(location)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <FormControl fullWidth>
                  <Select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select a city</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddLocation}
                  disabled={!newLocation}
                >
                  Add Location
                </Button>
              </>
            ) : (
              <Typography>{profile.locations.join(', ')}</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Services</Typography>
            {isEditing ? (
              <>
                <List>
                  {profile.services.map((service) => (
                    <ListItem key={service}>
                      <ListItemText primary={service} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveService(service)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <FormControl fullWidth>
                  <Select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select a service</MenuItem>
                    {[
                      "Haircut", "Hair Coloring", "Hair Styling", "Shampoo and Conditioning",
                      "Blow-Dry", "Hair Extensions", "Keratin Treatment", "Perming",
                      "Relaxing", "Scalp Treatment", "Braiding", "Updos",
                      "Beard Trimming", "Hair Weaving", "Balayage", "Ombre Coloring",
                      "Deep Conditioning Treatment", "Hot Oil Treatment", "Hair Straightening",
                      "Dreadlock Maintenance", "Nail Manicure", "Nail Pedicure",
                      "Acrylic Nails", "Gel Nails", "Nail Art", "Nail Extensions",
                      "French Manicure", "Nail Polish Application", "Paraffin Treatment", "Cuticle Care"
                    ].map((service) => (
                      <MenuItem key={service} value={service}>{service}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddService}
                  disabled={!newService}
                >
                  Add Service
                </Button>
              </>
            ) : (
              <Typography>{profile.services.join(', ')}</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            {!isEditing ? (
              <Button variant="contained" color="primary" type="submit">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>
                  Submit Changes
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Profile;