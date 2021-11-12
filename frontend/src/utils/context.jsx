import React, { useState, createContext } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageProfile, setImageProfile] = useState('light');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserdecoded = currentUser && jwt_decode(currentUser);
  const getUserImageProfile = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: currentUserdecoded.userId },
      })
      .then((user) => {
        setImageProfile(user.data.user.avatar);
      })
      .catch(() => {});
  };

  return (
    <ImageContext.Provider value={{ imageProfile, getUserImageProfile }}>
      {children}
    </ImageContext.Provider>
  );
};
