const express = require('express');
const router = express.Router();
// gravitar 
const gravitar = require('gravatar');

// Hash password
const bcrypt = require('bcryptjs');


// Load user module
const User = require('../../models/User');


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
                
                })

            }
        });
});




module.exports = router;

