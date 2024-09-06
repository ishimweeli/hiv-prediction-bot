import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FaHome, FaUser, FaCalendarAlt, FaMoneyBillWave, FaComment } from 'react-icons/fa';

const Sidebar = ({ activeTab, onTabChange, showSidebar }) => {
  return (
    <aside className={`bg-slate-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out md:relative md:translate-x-0`}>
      <List>
        <ListItem button selected={activeTab === 'home'} onClick={() => onTabChange('home')}>
          <ListItemIcon><FaHome color="white" /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button selected={activeTab === 'profile'} onClick={() => onTabChange('profile')}>
          <ListItemIcon><FaUser color="white" /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button selected={activeTab === 'bookings'} onClick={() => onTabChange('bookings')}>
          <ListItemIcon><FaCalendarAlt color="white" /></ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItem>
        <ListItem button selected={activeTab === 'payments'} onClick={() => onTabChange('payments')}>
          <ListItemIcon><FaMoneyBillWave color="white" /></ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
        <ListItem button selected={activeTab === 'comments'} onClick={() => onTabChange('comments')}>
          <ListItemIcon><FaComment color="white" /></ListItemIcon>
          <ListItemText primary="Comments" />
        </ListItem>
      </List>
    </aside>
  );
};

export default Sidebar;