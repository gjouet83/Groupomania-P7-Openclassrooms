import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const PrivateRouteAdmin = ({ children, ...rest }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser.admin == 1 ? (
          children
        ) : (
          <Redirect to={{ pathname: '/error', state: { from: location } }} />
        )
      }
    />
  );
};
export default PrivateRouteAdmin;
