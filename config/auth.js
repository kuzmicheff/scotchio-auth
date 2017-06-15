module.exports = {

  'facebookAuth': {
    'clientID':     process.env.fbAppId,
    'clientSecret': process.env.fbAppSecret,
    'callbackURL':  'http://localhost:9090/auth/facebook/callback',
    'profileURL':   'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  },

  'paypalAuth': {
    'clientID':     process.env.ppAppId,
    'clientSecret': process.env.ppAppSecret,
    'callbackURL':  'http://localhost:9090/auth/paypal/return',
    'paypalEnvironment': 'sandbox'
  }

};