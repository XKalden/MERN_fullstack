const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile Model
const User = require('../../models/User');

// import validation profile

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


// @route       Get Api/profile/test 
// @dec         Test Route
// @access      Public
router.get('/test', (req, res) => {res.json({msg: 'Profile Works'})});

// @route       Get Api/profile
// @dec         Get current user
// @access      Private
router.get('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id}) //user.id -> User schema
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this users';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route       Get Api/profile/all
// @dec         Get All Profile
// @access      Public
router.get('/all', (req,res) => {
    const errors = {}
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this users';
                return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({profile: 'There are no profile'}));
});

// @route       Get Api/profile/handle/:handle
// @dec         Get profile by handle name 
// @access      Public
router.get('/handle/:handle', (req,res) => {
    const errors = {};
    Profile.findOne({ handle : req.params.handle}) //user.id -> User schema
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this users';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route       Get Api/profile/user/:user_id
// @dec         Get profile by user ID
// @access      Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user : req.params.user_id }) //user.id -> User schema
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this users';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route       pust Api/profile
// @dec         Create or Edit user profile
// @access      Private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {

    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    
      // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id})
        .then(profile => {
            if(profile){
                // Update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields },
                    {new :true}
                ).then(profile => res.json(profile))
                .catch(err => res.json({error : err }));

            } else {
                // Create 

                // Check if Handle exists
                Profile.findOne({handle: profileFields.handle}).then(profile => {
                    if(profile){
                        errors.handle = 'That Handle already exists';
                        res.status(400).json(errors);
                    }

                    // Save Profile - and return data
                    new Profile(profileFields).save().then(profile => res.json(profile));

                })
            }
        })
});


// @route       POST api/profile/experience
// @dec         Add experience to profile
// @access      Private
router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validateExperienceInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
  
      Profile.findOne({ user: req.user.id }).then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
  
        // Add to exp array
        profile.experience.unshift(newExp);
  
        profile.save().then(profile => res.json(profile));
      });
    }
);

// @route       POST api/profile/edication
// @dec         Add Education to profile
// @access      Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req,res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id}).then(profile => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
          };
          
          // Add to exp array
          profile.education.unshift(newEdu);
          profile.save().then(profile => res.json(profile));
    });
});


// DELET Data 
// @route       POST api/profile/experience/:exp_id
// @dec         Delete experience from profile
// @access      Private
router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
  
          // Splice out of array
          profile.experience.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);


// DELET Data 
// @route       POST api/profile/experience/:exp_id
// @dec         Delete Education from profile
// @access      Private
router.delete(
    '/education/:exp_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.exp_id);
  
          // Splice out of array
          profile.education.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);


// @route       POST api/profile
// @dec         Delete user and profile
// @access      Private

router.delete('/' , passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({user: req.user.id})
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id }).then(() => 
                res.json({success: true })
            );
        });
});













module.exports = router;

