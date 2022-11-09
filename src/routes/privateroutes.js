import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuthToken } from '../utils/local';
import { getToken } from '../utils/session';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    component={(props) =>
      getToken()|| getAuthToken() ? (
        <React.Fragment>
          <Component {...props} />
        </React.Fragment>
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

export default PrivateRoute;
