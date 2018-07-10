import {GET_ERRORS, SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
// decode JWT Token at client side
import jwt_decode from 'jwt-decode';




// Register User 
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));

};



// Login User 
export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // Save to local Storage
            const {token} = res.data;

            // Set token to Local Storage
            localStorage.setItem('jwtToken', token);

            // Set Token to Auth Header
            setAuthToken(token);

            // Decode token to get User Data
            const decoded = jwt_decode(token);

            // Set current User
            dispatch( setCurrentUser(decoded));

        })
        .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));

};


// Set current User function
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}