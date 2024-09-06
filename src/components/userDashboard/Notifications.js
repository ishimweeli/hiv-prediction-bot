import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const Notifications = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // This would typically come from an API or state management
  const notifications = [
    { id: 1, message: 'New booking confirmed', date: '2023-06-01' },
    { id: 2, message: 'Payment received', date: '2023-05-30' },
    { id: 3, message: 'New comment on your listing', date: '2023-05-29' },
    { id: 4, message: 'Upcoming booking reminder', date: '2023-05-28' },
    { id: 5, message: 'Profile view notification', date: '2023-05-27' },
  ];

  const NotificationsList = () => (
    <List>
      {notifications.map((notification) => (
        <ListItem key={notification.id}>
          <ListItemText 
            primary={notification.message}
            secondary={notification.date}
          />
        </ListItem>
      ))}
    </List>
  );

  if (isMobile) {
    return (
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Notifications
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NotificationsList />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    isOpen && (
      <Paper 
        className="absolute right-0 mt-16 w-80 max-h-96 overflow-auto shadow-lg z-50"
        style={{ top: '64px' }} // Adjust based on your header height
      >
        <Typography variant="h6" className="p-3 bg-gray-100">
          Notifications
        </Typography>
        <NotificationsList />
      </Paper>
    )
  );
};

export default Notifications;