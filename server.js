const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


//api routes 
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

// Body parser middleware (--- post request return json data)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



// DB config
const db = require('./config/keys').mongoURI;
// DB connect to mongoDB
mongoose 
    .connect(db)   
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config strategy
require('./config/passport')(passport);


app.get('/', (req,res) => res.send('wow'));

// port routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);



const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}, ${db}`));
