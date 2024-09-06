import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  CircularProgress
} from '@mui/material';

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
      console.log(response);
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

  const handleArrayChange = (event, field) => {
    const { value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      console.log(profile)
      const data={
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        locations: profile.locations,
        services: profile.services,
        streetNumber: profile.streetNumber,
      }
      console.log(data)
      await axios.put(`${API_URL}/api/profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    //   setIsEditing(false);
    //   fetchProfile(); // Reload the profile after update
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (event) => {
    event.preventDefault(); // Prevent form submission
    setIsEditing(true);
  };

  const handleCancelEdit = (event) => {
    event.preventDefault(); // Prevent form submission
    setIsEditing(false);
    fetchProfile(); // Revert changes by fetching the profile again
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Locations</InputLabel>
              <Select
                multiple
                name="locations"
                value={profile.locations}
                onChange={(e) => handleArrayChange(e, 'locations')}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {["New York", "Los Angeles", "Chicago", "Houston"].map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Services</InputLabel>
              <Select
                multiple
                name="services"
                value={profile.services}
                onChange={(e) => handleArrayChange(e, 'services')}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {["Cleaning", "Gardening", "Plumbing", "Electrical"].map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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