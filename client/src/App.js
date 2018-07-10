import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// redux
import {Provider } from 'react-redux';
import store from './store';

// Local Storage Token setup
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';

import './App.css';
// check for token

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// check for token
if(localStorage.jwtToken){
  // Set auth Token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exprition
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

}

class App extends Component {
  render() {
    return (

      <Provider store={store}>
        <Router>
          <div className="App"> 
            <Navbar />
            <Route exact path="/" component={Landing} />

              <div className="containter">
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login} />
              </div>

            <Footer />
            
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
