var LocalStrategy =    require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var PaypalStrategy =   require('passport-paypal').Strategy;

var dbConfig =         require('./database');
var authConfig =       require('./auth');

var Sequelize =        require('sequelize');
var pg =               require('pg').native;
var pghstore =         require('pg-hstore');
var sequelize =        new Sequelize(dbConfig.url);

var User =             sequelize.import('../app/models/user');
User.sync();

module.exports = function(passport) {
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(function(user) {
        done(null, user);
      }).catch(function(e) {
        done(e, false);
      });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField:     'email',
    passwordField:     'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ where: { localemail: email } })
      .then(function(existingUser) {
        if (existingUser) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        if(req.user) {
          var user           = req.user;
          user.localemail    = email;
          user.localpassword = User.generateHash(password);
          user.save().catch(function (err) {
            throw err;
          }).then(function() {
            done(null, user);
          });
        } 
        else {
          var newUser = User.build({
            localemail:    email,
            localpassword: User.generateHash(password)
          }); 
          newUser.save()
            .then(function() {
              done (null, newUser);
            }).catch(function(err) {
              done(null, false, req.flash('signupMessage', err));
            });
        }
      })
      .catch(function (e) {
        done(null, false, req.flash('signupMessage',e.name + " " + e.message));        
      });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField:     'email',
    passwordField:     'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ where: { localemail: email } })
        .then(function(user) {
          if (!user) {
            done(null, false, req.flash('loginMessage', 'Unknown user'));
          } 
          else if (!user.validatePassword(password)) {
            done(null, false, req.flash('loginMessage', 'Wrong password'));
          } 
          else {
            done(null, user);
          }
        }).catch(function(e) { 
          done(null, false, req.flash('loginMessage',e.name + " " + e.message));
        });
  }));

  var fbAuthConfig = authConfig.facebookAuth;
  fbAuthConfig.passReqToCallback = true;

  passport.use(new FacebookStrategy(fbAuthConfig,
    function(req, token, refreshToken, profile, done) {
      if (!req.user) {
        User.findOne({ where : { 'facebookid' : profile.id }})
          .then(function(user) {
            if (user) {
              if (!user.facebooktoken) {
                user.facebooktoken = token;
                user.facebookname  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebookemail = profile.emails[0].value;
                user.save()
                  .then(function() {
                    done(null, user);
                  }).catch(function(e) {});
              }
              else {
                done(null, user);
              }
            }
            else {
              var newUser = User.build({
                facebookid: profile.id,
                facebooktoken: token,
                facebookname: profile.name.givenName + ' ' + profile.name.familyName,
                facebookemail: profile.emails[0].value
              }); 
              newUser.save()
                .then(function() {
                  done(null, user);
                }).catch(function(e) {});
            }
          });
        }
        else {
          var user           = req.user;
          user.facebookid    = profile.id;
          user.facebooktoken = token;
          user.facebookname  = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebookemail = profile.emails[0].value;
          user.save()
            .then(function() {
              done(null, user);
            }).catch(function(e) {});
        }
  }));
};
