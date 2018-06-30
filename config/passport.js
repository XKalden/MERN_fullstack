// passport strategy

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoogse = require('mongoose');
const User = mongoogse.model('users');


const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtkey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        
        User.findById(jwt_payload.id)
            .then(user => {
                if(user){       
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));


    }));
}

