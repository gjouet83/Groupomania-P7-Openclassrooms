import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
const PrivateRouteAdmin = ({ children, ...rest }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserdecoded = currentUser
    ? jwt_decode(currentUser)
    : currentUser;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUserdecoded.admin == 1 ? (
          children
        ) : (
          <Redirect to={{ pathname: '/error', state: { from: location } }} />
        )
      }
    />
  );
};
export default PrivateRouteAdmin;
