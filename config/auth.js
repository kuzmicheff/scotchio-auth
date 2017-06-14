module.exports = {

  'facebookAuth': {
    'clientID':      process.env.fbAppId,
    'clientSecret':  process.env.fbAppSecret,
    'callbackURL':   'http://localhost:9090/auth/facebook/callback',
    'profileURL':    'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  },

  'twitterAuth': {
    'consumerKey':    process.env.twAppId,
    'consumerSecret': process.env.twAppSecret,
    'callbackURL':    'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID':     process.env.glAppId,
    'clientSecret': process.env.glAppSecret,
    'callbackURL':  'http://localhost:8080/auth/google/callback'
  }

};