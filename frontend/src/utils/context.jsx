import React, { useState, createContext } from 'react';
import axios from 'axios';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageProfile, setImageProfile] = useState('light');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const getUserImageProfile = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { id: currentUser.userId },
      })
      .then((user) => {
        console.log(user.data);
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
