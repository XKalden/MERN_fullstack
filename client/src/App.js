import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// redux
import {Provider } from 'react-redux';
import store from './store';

// Local Storage Token setup
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard' 

// private route for authentication
import PrivateRoute from './components/common/PrivateRoute';

import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile.js';





// check for token
if(localStorage.jwtToken){
  // Set auth Token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exprition
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for Expired token 
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime){
    //Logout User
    store.dispatch(logoutUser());
    
    //Clear Current Profile
    store.dispatch(clearCurrentProfile());

    // Redirect to Login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (

      <Provider store={store}>
        <Router>
          <div className="App"> 
            <Navbar />
            <Route exact path="/" component={Landing} />

              <div className="container">
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login} />

                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
             
                  <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                  
                  <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                </Switch>
              </div>

            <Footer />
            
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
