import React from 'react';
import ReactDOM from 'react-dom';
import Header from './layout/Header';
import Posts from './pages/Posts';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Comments from './pages/Comments';
import Profil from './pages/Profil';
import Params from './pages/Params';
import Admin from './pages/Admin';
import PrivateRouteAdmin from './components/PrivateRouteAdmin';
import Error from './pages/Error';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './sass/style.scss';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/posts">
          <Posts />
        </Route>
        <Route path="/comments">
          <Comments />
        </Route>
        <Route path="/profil">
          <Profil />
        </Route>
        <Route path="/params">
          <Params />
        </Route>
        <PrivateRouteAdmin path="/admin">
          <Route component={Admin} />
        </PrivateRouteAdmin>
        <Route>
          <Error />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
