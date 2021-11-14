import React, { useState, createContext } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageProfile, setImageProfile] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user')); //on récupère le token dans le localstorage
  const currentUserdecoded = currentUser && jwt_decode(currentUser); //on décode le token

  const getUserImageProfile = () => {
    axios
      .get('http://localhost:3000/api/users/get/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { id: currentUserdecoded.userId },
      })
      .then((user) => {
        //on stocke l'image du profil
        setImageProfile(user.data.user.avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ImageContext.Provider value={{ imageProfile, getUserImageProfile }}>
      {children}
    </ImageContext.Provider>
  );
};
