
import React, { useState, useEffect } from 'react';
import { Avatar, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: '',
    profileImage: ''
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleClose();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <>
      <Avatar
        sx={{ bgcolor: "#00712D", cursor: "pointer" }}
        onClick={handleClick}
        alt={userData.name}
        src={userData.profileImage}
      />
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-avatar',
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;

