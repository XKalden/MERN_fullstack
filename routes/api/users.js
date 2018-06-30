const express = require('express');
const router = express.Router();
// gravitar 
const gravitar = require('gravatar');
// Hash password
const bcrypt = require('bcryptjs');
// Load user module
const User = require('../../models/User');
// Json webtoken 
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const passport = require('passport');



// @route       Get Api/users/test 
// @dec         Test Route
// @access      Public

router.get('/test', (req, res) => {res.json({msg: 'Users Works'})});


// @route       Get Api/users/register 
// @dec         Register user
// @access      Public
router.post('/register', (req,res) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already Exists'});
            } else {
                // gravitar image generator 
                const avatar = gravitar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password

                });

                // generate Hash password and push to data base
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                
                });
            }
        });
});


// @route       Get Api/users/login 
// @dec         Login User / Return JWT Token
// @access      Public
router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find User by email
    User.findOne({email})
        .then(user => {
            //check user 
            if(!user){
                return res.status(404).json({email: 'User not Found'});
            }
            // check Password
            bcrypt.compare(password, user.password)
                .then( isMatch => {
                    if(isMatch){
                        // user matched
                        const payload = {id: user.id, name: user.name, avatar: user.avatar} // create JWT Payload
                    

                        //Sign token
                        jwt.sign(payload, keys.jwtkey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                            })
                        });

                    } else {
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                })
        });
});


// @route       Get Api/users/current 
// @dec         Return current user / Return JWT Token
// @access      Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });

});


module.exports = router;

